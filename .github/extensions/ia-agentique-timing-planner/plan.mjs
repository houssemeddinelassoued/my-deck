// Program structure for the IA agentique deck and the schedule computation.

export const DECK_ID = 'ia-agentique-feuille-de-route';

// Mirrors the J1_Program page (planned module starts and breaks).
export const DAYS = [
  { day: 1, title: 'Jour 1 · Comprendre les agents', firstPage: 'J1_Cover', start: '09:00', end: '16:00' },
  { day: 2, title: 'Jour 2 · Construire la feuille de route', firstPage: 'J2o_Cover', start: '09:00', end: '16:00' },
];

export const SEGMENTS = [
  { id: 'j1-accueil', day: 1, firstPage: 'J1_Cover', name: 'Accueil et tour de table', planned: '09:00', tone: 'slate' },
  { id: 'm1', day: 1, firstPage: 'M1_Divider', name: 'M1 · Introduction aux agents IA', planned: '09:30', tone: 'blue' },
  { id: 'm2', day: 1, firstPage: 'M23_Divider2', name: 'M2 · Atelier · identifier un agent', planned: '11:30', tone: 'yellow' },
  { id: 'm3', day: 1, firstPage: 'M23_Divider3', name: 'M3 · Typologie des agents', planned: '13:00', tone: 'violet' },
  { id: 'm4', day: 1, firstPage: 'M4_Divider', name: 'M4 · Études de cas réels', planned: '14:30', tone: 'teal' },
  { id: 'j1-synthese', day: 1, firstPage: 'M4_DaySynth', name: 'Synthèse du jour 1', planned: '15:40', tone: 'slate' },
  { id: 'j2-reactivation', day: 2, firstPage: 'J2o_Cover', name: 'Réactivation', planned: '09:00', tone: 'slate' },
  { id: 'm5', day: 2, firstPage: 'M5_Divider', name: "M5 · Analyse de cas d'usage", planned: '09:15', tone: 'blue' },
  { id: 'm6', day: 2, firstPage: 'M6_Divider', name: 'M6 · Définition du périmètre', planned: '10:45', tone: 'coral' },
  { id: 'm7', day: 2, firstPage: 'M78_Divider7', name: 'M7 · Conception et choix des outils', planned: '13:00', tone: 'violet' },
  { id: 'm8', day: 2, firstPage: 'M78_Divider8', name: 'M8 · Atelier · prototyper un agent', planned: '13:50', tone: 'yellow' },
  { id: 'm9', day: 2, firstPage: 'M910_M9Divider', name: 'M9 · Plan de déploiement', planned: '15:00', tone: 'teal' },
  { id: 'm10', day: 2, firstPage: 'M10a_Divider', name: 'M10 · Mesure de performance', planned: '15:30', tone: 'green' },
  { id: 'cloture', day: 2, firstPage: 'Cl2_Roadmap', name: 'Feuille de route et clôture', planned: '15:50', tone: 'slate' },
];

export const BREAKS = [
  { id: 'j1-pause-matin', day: 1, label: 'Pause', beforePage: 'M1b_Workflow', start: '10:30', minutes: 15 },
  { id: 'j1-diner', day: 1, label: 'Dîner', beforePage: 'M23_Divider3', start: '12:00', minutes: 60 },
  { id: 'j1-pause-aprem', day: 1, label: 'Pause', beforePage: 'M4_Divider', start: '14:15', minutes: 15 },
  { id: 'j2-pause-matin', day: 2, label: 'Pause', beforePage: 'M6_Divider', start: '10:30', minutes: 15 },
  { id: 'j2-diner', day: 2, label: 'Dîner', beforePage: 'M78_Divider7', start: '12:00', minutes: 60 },
  { id: 'j2-pause-aprem', day: 2, label: 'Pause', beforePage: 'M910_M9Divider', start: '14:50', minutes: 10 },
];

export const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export function parseTime(s) {
  const m = TIME_RE.exec(String(s));
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

export function fmtTime(min) {
  if (min == null) return null;
  const sign = min < 0 ? '-' : '';
  const a = Math.abs(Math.round(min));
  return `${sign}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
}

export function fmtDelta(d) {
  if (d == null) return null;
  if (d === 0) return '0 min';
  return `${d > 0 ? '+' : '−'}${Math.abs(d)} min`;
}

/** Splits deck pages into days according to DAYS[].firstPage. */
export function pagesByDay(deck) {
  const idx = new Map(deck.pages.map((p, i) => [p.name, i]));
  const bounds = DAYS.map((d) => idx.get(d.firstPage));
  return DAYS.map((d, k) => {
    const from = bounds[k];
    if (from == null) return { day: d.day, pages: [] };
    const next = bounds.slice(k + 1).find((b) => b != null);
    return { day: d.day, pages: deck.pages.slice(from, next ?? deck.pages.length) };
  });
}

export function effectiveConfig(state) {
  const days = DAYS.map((d) => ({ ...d, ...(state.days[String(d.day)] ?? {}) }));
  const breaks = BREAKS.map((b) => ({ ...b, ...(state.breaks[b.id] ?? {}) }));
  return { days, breaks };
}

export function computePlan(deck, state) {
  const { days, breaks } = effectiveConfig(state);
  const warnings = [...deck.warnings];
  const split = pagesByDay(deck);
  const pageIndex = new Map(deck.pages.map((p) => [p.name, p.index]));

  for (const d of DAYS) if (!pageIndex.has(d.firstPage)) warnings.push(`Page de début du jour ${d.day} introuvable : ${d.firstPage}.`);
  for (const s of SEGMENTS) if (!pageIndex.has(s.firstPage)) warnings.push(`Page de début de « ${s.name} » introuvable : ${s.firstPage}.`);
  const firstDayStart = pageIndex.get(DAYS[0].firstPage);
  if (firstDayStart > 1) warnings.push(`${firstDayStart - 1} page(s) avant ${DAYS[0].firstPage} ne sont pas planifiées.`);

  const outDays = days.map((dayCfg) => {
    const pages = split.find((s) => s.day === dayCfg.day)?.pages ?? [];
    const dayStart = parseTime(dayCfg.start);
    const dayEnd = parseTime(dayCfg.end);
    const segs = SEGMENTS.filter((s) => s.day === dayCfg.day && pageIndex.has(s.firstPage)).map((s) => ({
      ...s,
      plannedMin: parseTime(s.planned),
      actualStart: null,
      content: 0,
    }));
    const segByFirst = new Map(segs.map((s) => [s.firstPage, s]));
    const dayBreaks = breaks.filter((b) => b.day === dayCfg.day);
    const pageNames = new Set(pages.map((p) => p.name));
    for (const b of dayBreaks) {
      if (!pageNames.has(b.beforePage)) warnings.push(`${b.label} (${b.id}) : page « ${b.beforePage} » absente du jour ${dayCfg.day}, pause ignorée.`);
    }

    const items = [];
    let t = dayStart;
    let seg = null;
    for (const p of pages) {
      for (const b of dayBreaks.filter((x) => x.beforePage === p.name).sort((x, y) => parseTime(x.start) - parseTime(y.start))) {
        const planned = parseTime(b.start);
        const slack = planned - t;
        if (slack > 0) items.push({ type: 'slack', start: t, end: planned, minutes: slack, before: b.id });
        const begin = Math.max(t, planned);
        items.push({
          type: 'break', id: b.id, label: b.label, beforePage: b.beforePage,
          plannedStart: planned, start: begin, end: begin + b.minutes, minutes: b.minutes,
          arrival: t, delta: t - planned,
        });
        t = begin + b.minutes;
      }
      if (segByFirst.has(p.name)) {
        seg = segByFirst.get(p.name);
        seg.actualStart = t;
      }
      const override = state.overrides[p.name];
      const minutes = Number.isInteger(override) ? override : p.minutes;
      const item = {
        type: 'page', index: p.index, name: p.name, label: p.label, segment: seg?.id ?? null,
        baseMinutes: p.minutes, minutes, overridden: Number.isInteger(override),
        start: t, end: t + minutes,
        anchor: p.anchor, anchorDelta: p.anchor == null ? null : t - p.anchor,
        endAnchor: p.endAnchor, endAnchorDelta: p.endAnchor == null ? null : t + minutes - p.endAnchor,
      };
      if (seg) seg.content += minutes;
      items.push(item);
      t += minutes;
    }

    const sorted = [...segs].sort((a, b) => a.plannedMin - b.plannedMin);
    for (let k = 0; k < sorted.length; k += 1) {
      const s = sorted[k];
      const until = sorted[k + 1]?.plannedMin ?? dayEnd;
      const breakMin = dayBreaks
        .filter((b) => pageNames.has(b.beforePage))
        .map((b) => ({ s: parseTime(b.start), m: b.minutes }))
        .filter((b) => b.s >= s.plannedMin && b.s < until)
        .reduce((a, b) => a + b.m, 0);
      s.budget = until - s.plannedMin - breakMin;
      s.margin = s.budget - s.content;
      s.delta = s.actualStart == null ? null : s.actualStart - s.plannedMin;
    }

    const content = items.filter((i) => i.type === 'page').reduce((a, i) => a + i.minutes, 0);
    const breakTotal = items.filter((i) => i.type === 'break').reduce((a, i) => a + i.minutes, 0);
    const slackTotal = items.filter((i) => i.type === 'slack').reduce((a, i) => a + i.minutes, 0);
    return {
      day: dayCfg.day, title: dayCfg.title, start: dayStart, end: dayEnd,
      computedEnd: t, endDelta: t - dayEnd, content, breakTotal, slackTotal,
      pageCount: pages.length, segments: segs, items,
      breaks: dayBreaks.map((b) => ({ ...b, placed: pageNames.has(b.beforePage) })),
      pageOptions: pages.map((p) => ({ name: p.name, index: p.index })),
    };
  });

  return {
    deck: { id: DECK_ID, title: deck.title, pageCount: deck.pages.length },
    overrideCount: Object.keys(state.overrides).length,
    days: outDays,
    warnings,
  };
}

/** Compact, agent-friendly rendering of a computed plan. */
export function summarizePlan(plan, { day, includePages = false } = {}) {
  const days = plan.days.filter((d) => day == null || d.day === day);
  return {
    deck: plan.deck,
    overrideCount: plan.overrideCount,
    warnings: plan.warnings,
    days: days.map((d) => ({
      day: d.day,
      title: d.title,
      hours: `${fmtTime(d.start)}–${fmtTime(d.end)}`,
      computedEnd: fmtTime(d.computedEnd),
      endDelta: fmtDelta(d.endDelta),
      contentMinutes: d.content,
      breakMinutes: d.breakTotal,
      slackBeforeBreaksMinutes: d.slackTotal,
      modules: d.segments.map((s) => ({
        id: s.id, name: s.name, planned: s.planned, computed: fmtTime(s.actualStart),
        startDelta: fmtDelta(s.delta), budgetMinutes: s.budget, contentMinutes: s.content, marginMinutes: s.margin,
      })),
      breaks: d.items.filter((i) => i.type === 'break').map((b) => ({
        id: b.id, label: b.label, beforePage: b.beforePage, planned: fmtTime(b.plannedStart),
        reachedAt: fmtTime(b.arrival), delta: fmtDelta(b.delta), resumesAt: fmtTime(b.end),
      })),
      ...(includePages
        ? {
            pages: d.items.filter((i) => i.type === 'page').map((p) => ({
              index: p.index, name: p.name, label: p.label, minutes: p.minutes,
              ...(p.overridden ? { notesMinutes: p.baseMinutes } : {}),
              start: fmtTime(p.start), end: fmtTime(p.end),
              ...(p.anchor != null ? { notesAnchor: fmtTime(p.anchor), anchorDelta: fmtDelta(p.anchorDelta) } : {}),
            })),
          }
        : {}),
    })),
  };
}
