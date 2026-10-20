// Client for the timing planner canvas. Builds DOM with textContent only (no innerHTML).
const $ = (sel) => document.querySelector(sel);
const statusEl = $('#status');
const errorEl = $('#error');
const daysEl = $('#days');
let plan = null;
let busy = false;

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'style') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}

const fmt = (m) => (m == null ? '—' : `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
const fmtDur = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}` : `${m} min`);
function deltaText(d) {
  if (d == null) return '—';
  if (d === 0) return '0';
  return `${d > 0 ? '+' : '−'}${Math.abs(d)} min`;
}
function deltaClass(d) {
  if (d == null || Math.abs(d) <= 2) return 'delta-ok';
  return d > 0 ? 'delta-late' : 'delta-early';
}
function deltaCell(d, label) {
  const words = d == null ? '' : d > 0 ? ' (en retard)' : d < 0 ? ' (en avance)' : '';
  return h('td', { class: `num ${deltaClass(d)}` }, deltaText(d), h('span', { class: 'sr-only', text: words || (label ?? '') }));
}
function marginCell(m) {
  const cls = m < 0 ? 'delta-late' : m > 0 ? 'delta-early' : 'delta-ok';
  return h('td', { class: `num ${cls}` }, m > 0 ? `+${m} min` : m < 0 ? `−${-m} min` : '0');
}

function setStatus(msg) {
  statusEl.textContent = msg;
}
function showError(msg) {
  errorEl.hidden = !msg;
  errorEl.textContent = msg ?? '';
}

async function api(path, body) {
  const res = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data;
}

async function load(reason) {
  try {
    plan = await api('/api/plan');
    showError(null);
    render();
    const late = plan.days.filter((d) => d.endDelta > 0);
    setStatus(
      `${reason ? `${reason} · ` : ''}${plan.deck.pageCount} pages · ` +
        (late.length ? `Dépassement : ${late.map((d) => `jour ${d.day} ${deltaText(d.endDelta)}`).join(', ')}` : 'Les deux journées tiennent dans l’horaire') +
        ` · ${new Date().toLocaleTimeString('fr-FR', { hour12: false })}`,
    );
  } catch (err) {
    showError(`Impossible de charger le planning : ${err.message}`);
  }
}

async function mutate(path, body, okMsg) {
  if (busy) return;
  busy = true;
  try {
    await api(path, body);
    await load(okMsg);
  } catch (err) {
    showError(err.message);
    await load();
  } finally {
    busy = false;
  }
}

function timeline(day) {
  const from = Math.min(day.start, ...day.items.map((i) => i.start));
  const to = Math.max(day.end, day.computedEnd) + 5;
  const pct = (m) => `${((m - from) / (to - from)) * 100}%`;
  const width = (a, b) => `${((b - a) / (to - from)) * 100}%`;
  const segTone = new Map(day.segments.map((s) => [s.id, s]));
  const blocks = [];
  let cur = null;
  for (const it of day.items) {
    if (it.type === 'page') {
      if (cur && cur.segment === it.segment && cur.end === it.start) cur.end = it.end;
      else blocks.push((cur = { kind: 'seg', segment: it.segment, start: it.start, end: it.end }));
    } else {
      cur = null;
      blocks.push({ kind: it.type, start: it.start, end: it.end, label: it.label, minutes: it.minutes });
    }
  }
  const late = day.endDelta > 0;
  const summary =
    `Frise du jour ${day.day} : de ${fmt(day.start)} à ${fmt(day.computedEnd)} ` +
    `(fin prévue ${fmt(day.end)}, ${late ? `${day.endDelta} min de dépassement` : `${-day.endDelta} min de marge`}).`;
  const ticks = [];
  for (let m = Math.ceil(from / 60) * 60; m <= to; m += 60) ticks.push(h('span', { class: 'tl-tick', style: { left: pct(m) }, text: `${m / 60} h` }));
  return h(
    'div',
    { class: 'timeline', role: 'img', 'aria-label': summary },
    late ? h('div', { class: 'tl-over', style: { left: pct(day.end), width: width(day.end, day.computedEnd) } }) : null,
    blocks.map((b) => {
      if (b.kind === 'seg') {
        const s = segTone.get(b.segment);
        return h('div', {
          class: `tl-block tone-${s?.tone ?? 'slate'}`,
          style: { left: pct(b.start), width: width(b.start, b.end) },
          title: `${s?.name ?? 'Hors module'} · ${fmt(b.start)}–${fmt(b.end)}`,
          text: s ? s.name.split(' · ')[0] : '',
        });
      }
      if (b.kind === 'break') {
        return h('div', { class: 'tl-block tl-break', style: { left: pct(b.start), width: width(b.start, b.end) }, title: `${b.label} · ${fmt(b.start)}–${fmt(b.end)}`, text: b.label });
      }
      return h('div', { class: 'tl-block tl-slack', style: { left: pct(b.start), width: width(b.start, b.end) }, title: `Marge libre · ${b.minutes} min` });
    }),
    h('div', { class: 'tl-end', style: { left: pct(day.end) }, title: `Fin prévue ${fmt(day.end)}` }),
    ticks,
  );
}

function hoursEditor(day) {
  const make = (field, value, label) =>
    h('label', {}, label, h('input', {
      type: 'time', value: fmt(value), 'data-focus': `day-${day.day}-${field}`,
      onchange: (e) => e.target.value && mutate('/api/day', { day: day.day, [field]: e.target.value }, `Horaire du jour ${day.day} mis à jour`),
    }));
  return h('div', { class: 'hours' }, make('start', day.start, 'Début'), make('end', day.end, 'Fin'));
}

function stats(day) {
  const item = (k, v, cls) => h('li', {}, h('span', { class: 'k', text: k }), h('span', { class: `v ${cls ?? ''}`, text: v }));
  return h(
    'ul',
    { class: 'stats' },
    item('Fin calculée', fmt(day.computedEnd)),
    item('Écart à la fin', deltaText(day.endDelta), deltaClass(day.endDelta)),
    item('Contenu', fmtDur(day.content)),
    item('Pauses', fmtDur(day.breakTotal)),
    item('Marge avant pauses', fmtDur(day.slackTotal)),
  );
}

function modulesTable(day) {
  return h(
    'table',
    {},
    h('caption', { text: 'Modules : horaire du programme vs minutage des notes' }),
    h('thead', {}, h('tr', {}, ['Module', 'Prévu', 'Calculé', 'Écart', 'Budget', 'Contenu', 'Marge'].map((t, i) => h('th', { scope: 'col', class: i ? 'num' : null, text: t })))),
    h(
      'tbody',
      {},
      day.segments.map((s) =>
        h('tr', {},
          h('th', { scope: 'row' }, h('span', { class: `swatch tone-${s.tone}`, 'aria-hidden': 'true' }), s.name),
          h('td', { class: 'num', text: s.planned }),
          h('td', { class: 'num', text: fmt(s.actualStart) }),
          deltaCell(s.delta),
          h('td', { class: 'num', text: fmtDur(s.budget) }),
          h('td', { class: 'num', text: fmtDur(s.content) }),
          marginCell(s.margin),
        ),
      ),
    ),
  );
}

function breaksTable(day) {
  const reached = new Map(day.items.filter((i) => i.type === 'break').map((b) => [b.id, b]));
  return h(
    'table',
    {},
    h('caption', { text: 'Pauses (la reprise ne se fait jamais avant l’heure prévue + la durée)' }),
    h('thead', {}, h('tr', {}, ['Pause', 'Avant la page', 'Heure prévue', 'Durée (min)', 'Atteinte à', 'Écart', 'Reprise'].map((t) => h('th', { scope: 'col', text: t })))),
    h(
      'tbody',
      {},
      day.breaks.map((b) => {
        const r = reached.get(b.id);
        const sel = h(
          'select',
          {
            'aria-label': `Page avant laquelle prendre « ${b.label} » (${b.start})`,
            'data-focus': `brk-${b.id}-page`,
            onchange: (e) => mutate('/api/break', { id: b.id, beforePage: e.target.value }, `${b.label} déplacée`),
          },
          day.pageOptions.map((p) => h('option', { value: p.name, selected: p.name === b.beforePage, text: `${p.index}. ${p.name}` })),
        );
        return h('tr', {},
          h('th', { scope: 'row', text: b.label }),
          h('td', {}, sel, b.placed ? null : h('span', { class: 'pill pill-late', text: 'non placée' })),
          h('td', {}, h('input', {
            type: 'time', value: b.start, 'aria-label': `Heure prévue de « ${b.label} »`, 'data-focus': `brk-${b.id}-start`,
            onchange: (e) => e.target.value && mutate('/api/break', { id: b.id, start: e.target.value }, `${b.label} mise à jour`),
          })),
          h('td', {}, h('input', {
            type: 'number', min: 0, max: 180, step: 5, value: b.minutes, 'aria-label': `Durée de « ${b.label} » en minutes`, 'data-focus': `brk-${b.id}-min`,
            onchange: (e) => {
              const v = Number(e.target.value);
              if (Number.isInteger(v) && v >= 0 && v <= 180) mutate('/api/break', { id: b.id, minutes: v }, `${b.label} mise à jour`);
              else showError('La durée d’une pause doit être un entier entre 0 et 180.');
            },
          })),
          h('td', { class: 'num', text: r ? fmt(r.arrival) : '—' }),
          deltaCell(r?.delta),
          h('td', { class: 'num', text: r ? fmt(r.end) : '—' }),
        );
      }),
    ),
  );
}

function pageRow(p) {
  const input = h('input', {
    type: 'number', min: 0, max: 240, step: 1, value: p.minutes,
    'aria-label': `Durée de la page ${p.index} ${p.name} en minutes`,
    'data-focus': `page-${p.name}`,
    onchange: (e) => {
      const v = Number(e.target.value);
      if (e.target.value === '' ) mutate('/api/page-minutes', { page: p.name, minutes: null }, `Page ${p.index} rétablie`);
      else if (Number.isInteger(v) && v >= 0 && v <= 240) mutate('/api/page-minutes', { page: p.name, minutes: v }, `Page ${p.index} : ${v} min`);
      else showError('La durée doit être un entier entre 0 et 240.');
    },
  });
  const anchor =
    p.anchor != null
      ? h('span', {}, `≈ ${fmt(p.anchor)} `, h('span', { class: `pill ${p.anchorDelta > 2 ? 'pill-late' : p.anchorDelta < -2 ? 'pill-early' : ''}`, text: deltaText(p.anchorDelta) }))
      : p.endAnchor != null
        ? h('span', {}, `fin ${fmt(p.endAnchor)} `, h('span', { class: `pill ${p.endAnchorDelta > 2 ? 'pill-late' : p.endAnchorDelta < -2 ? 'pill-early' : ''}`, text: deltaText(p.endAnchorDelta) }))
        : '';
  return h('tr', { class: p.overridden ? 'overridden' : null },
    h('td', { class: 'num', text: p.index }),
    h('td', {}, h('span', { class: 'page-name', text: p.name })),
    h('td', { text: p.label }),
    h('td', { class: 'dur' }, input,
      p.overridden
        ? h('span', {}, h('span', { class: 'hint', text: `notes : ${p.baseMinutes}` }), ' ',
            h('button', { type: 'button', class: 'btn btn-mini', 'aria-label': `Rétablir la durée des notes pour la page ${p.index}`, 'data-focus': `reset-${p.name}`,
              onclick: () => mutate('/api/page-minutes', { page: p.name, minutes: null }, `Page ${p.index} rétablie`) }, '↺'))
        : null),
    h('td', { class: 'num', text: `${fmt(p.start)}–${fmt(p.end)}` }),
    h('td', {}, anchor),
  );
}

function pagesSection(day, openSet) {
  const groups = [];
  let g = null;
  for (const it of day.items) {
    if (it.type === 'slack') continue;
    const segId = it.type === 'page' ? it.segment : g?.id;
    if (!g || g.id !== segId) groups.push((g = { id: segId, rows: [] }));
    g.rows.push(it);
  }
  const segs = new Map(day.segments.map((s) => [s.id, s]));
  return groups.map((grp) => {
    const s = segs.get(grp.id);
    const key = `${day.day}:${grp.id}`;
    const pages = grp.rows.filter((r) => r.type === 'page');
    const overrides = pages.filter((p) => p.overridden).length;
    const det = h('details', { 'data-key': key, open: openSet.has(key) },
      h('summary', {},
        h('span', { class: `swatch tone-${s?.tone ?? 'slate'}`, 'aria-hidden': 'true' }),
        `${s?.name ?? 'Hors module'} — ${pages.length} pages, ${fmtDur(pages.reduce((a, p) => a + p.minutes, 0))}`,
        overrides ? ` · ${overrides} ajustée(s)` : ''),
      h('div', {},
        h('table', {},
          h('thead', {}, h('tr', {}, ['#', 'Page', 'Libellé (notes)', 'Durée (min)', 'Horaire', 'Repère des notes'].map((t) => h('th', { scope: 'col', text: t })))),
          h('tbody', {}, grp.rows.map((r) =>
            r.type === 'page'
              ? pageRow(r)
              : h('tr', { class: 'break-row' }, h('td', {}), h('td', { colspan: 3, text: `${r.label} · ${r.minutes} min` }), h('td', { class: 'num', text: `${fmt(r.start)}–${fmt(r.end)}` }), h('td', {})),
          )),
        ),
      ),
    );
    return det;
  });
}

function render() {
  const active = document.activeElement?.dataset?.focus;
  const openSet = new Set([...document.querySelectorAll('details[open]')].map((d) => d.dataset.key));
  $('#deck-title').textContent = plan.deck.title;
  const warn = $('#warnings');
  warn.hidden = !plan.warnings.length;
  warn.querySelector('ul').replaceChildren(...plan.warnings.map((w) => h('li', { text: w })));
  $('#reset-overrides').textContent = `Réinitialiser les durées${plan.overrideCount ? ` (${plan.overrideCount})` : ''}`;
  $('#reset-overrides').disabled = !plan.overrideCount;

  daysEl.replaceChildren(
    ...plan.days.map((day) =>
      h('section', { class: 'day', 'aria-labelledby': `day-${day.day}-title` },
        h('div', { class: 'day-head' }, h('h2', { id: `day-${day.day}-title`, text: day.title }), hoursEditor(day)),
        stats(day),
        timeline(day),
        modulesTable(day),
        h('h3', { text: 'Pauses' }),
        breaksTable(day),
        h('h3', { text: `Pages (${day.pageCount})` }),
        pagesSection(day, openSet),
      ),
    ),
  );
  if (active) document.querySelector(`[data-focus="${CSS.escape(active)}"]`)?.focus();
}

$('#reset-overrides').addEventListener('click', () => mutate('/api/reset', { scope: 'overrides' }, 'Durées rétablies depuis les notes'));
const resetAll = $('#reset-all');
let armTimer = null;
resetAll.addEventListener('click', () => {
  if (armTimer) {
    clearTimeout(armTimer);
    armTimer = null;
    resetAll.textContent = 'Tout réinitialiser';
    mutate('/api/reset', { scope: 'all' }, 'Planning réinitialisé (durées, pauses, horaires)');
    return;
  }
  resetAll.textContent = 'Confirmer : tout réinitialiser ?';
  setStatus('Cliquez à nouveau pour rétablir durées, pauses et horaires par défaut.');
  armTimer = setTimeout(() => {
    armTimer = null;
    resetAll.textContent = 'Tout réinitialiser';
  }, 5000);
});

let pendingReload = false;
const editing = () => {
  const a = document.activeElement;
  return a && daysEl.contains(a) && (a.tagName === 'INPUT' || a.tagName === 'SELECT');
};
daysEl.addEventListener('focusout', () => {
  setTimeout(() => {
    if (pendingReload && !editing() && !busy) {
      pendingReload = false;
      load('Mis à jour');
    }
  }, 0);
});

const events = new EventSource('/api/events');
events.addEventListener('changed', () => {
  if (busy) return;
  if (editing()) pendingReload = true;
  else load('Mis à jour');
});

load();
