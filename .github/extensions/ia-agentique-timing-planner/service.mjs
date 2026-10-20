// Shared planner logic: input validation and mutations used by both canvas actions and HTTP.
import { DeckError, deckSignature, loadDeck } from './deck.mjs';
import { BREAKS, DAYS, TIME_RE, computePlan, effectiveConfig, pagesByDay, parseTime } from './plan.mjs';
import { PlanStore, StoreError } from './store.mjs';

export class PlannerError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const isObj = (v) => v != null && typeof v === 'object' && !Array.isArray(v);

function allowKeys(input, keys) {
  if (!isObj(input)) throw new PlannerError('INVALID_INPUT', 'Input must be an object.');
  const extra = Object.keys(input).filter((k) => !keys.includes(k));
  if (extra.length) throw new PlannerError('INVALID_INPUT', `Unknown field(s): ${extra.join(', ')}.`);
}

function checkMinutes(v, field, max = 600) {
  if (!Number.isInteger(v) || v < 0 || v > max) {
    throw new PlannerError('INVALID_INPUT', `${field} must be an integer between 0 and ${max}.`);
  }
}

function checkTime(v, field) {
  if (typeof v !== 'string' || !TIME_RE.test(v)) throw new PlannerError('INVALID_INPUT', `${field} must be "HH:MM".`);
  const [h, m] = v.split(':');
  return `${h.padStart(2, '0')}:${m}`;
}

function wrap(err) {
  if (err instanceof PlannerError) return err;
  if (err instanceof StoreError || err instanceof DeckError) return new PlannerError(err.code, err.message);
  return new PlannerError('INTERNAL', err?.message ?? String(err));
}

export class Planner {
  constructor(canvasId, deckPath) {
    this.deckPath = deckPath;
    this.store = new PlanStore(canvasId, deckPath);
  }

  async signature() {
    return `${await deckSignature(this.deckPath)}|${await this.store.signature()}`;
  }

  async view() {
    try {
      const [deck, state] = await Promise.all([loadDeck(this.deckPath), this.store.read()]);
      return computePlan(deck, state);
    } catch (err) {
      throw wrap(err);
    }
  }

  resolvePage(deck, page) {
    if (Number.isInteger(page)) {
      const p = deck.pages[page - 1];
      if (!p) throw new PlannerError('UNKNOWN_PAGE', `Page index ${page} is out of range 1–${deck.pages.length}.`);
      return p;
    }
    if (typeof page === 'string' && page.trim()) {
      const p = deck.pages.find((x) => x.name === page.trim());
      if (!p) throw new PlannerError('UNKNOWN_PAGE', `No page component named "${page}".`);
      return p;
    }
    throw new PlannerError('INVALID_INPUT', 'page must be a 1-based page index or a page component name.');
  }

  async setPageMinutes(input) {
    try {
      allowKeys(input, ['page', 'minutes']);
      const deck = await loadDeck(this.deckPath);
      const p = this.resolvePage(deck, input.page);
      if (input.minutes !== null) checkMinutes(input.minutes, 'minutes', 240);
      await this.store.update((s) => {
        if (input.minutes === null || input.minutes === p.minutes) delete s.overrides[p.name];
        else s.overrides[p.name] = input.minutes;
      });
      return { page: p.index, name: p.name, notesMinutes: p.minutes, minutes: input.minutes ?? p.minutes };
    } catch (err) {
      throw wrap(err);
    }
  }

  async setBreak(input) {
    try {
      allowKeys(input, ['id', 'start', 'minutes', 'beforePage']);
      const def = BREAKS.find((b) => b.id === input.id);
      if (!def) throw new PlannerError('UNKNOWN_BREAK', `Unknown break id. Known: ${BREAKS.map((b) => b.id).join(', ')}.`);
      const patch = {};
      if (input.start !== undefined) patch.start = checkTime(input.start, 'start');
      if (input.minutes !== undefined) {
        checkMinutes(input.minutes, 'minutes', 180);
        patch.minutes = input.minutes;
      }
      if (input.beforePage !== undefined) {
        const deck = await loadDeck(this.deckPath);
        const p = this.resolvePage(deck, input.beforePage);
        const dayPages = pagesByDay(deck).find((d) => d.day === def.day)?.pages ?? [];
        if (!dayPages.some((x) => x.name === p.name)) {
          throw new PlannerError('INVALID_INPUT', `Page ${p.name} is not part of day ${def.day}.`);
        }
        patch.beforePage = p.name;
      }
      if (!Object.keys(patch).length) throw new PlannerError('INVALID_INPUT', 'Provide start, minutes and/or beforePage.');
      const state = await this.store.update((s) => {
        const merged = { ...(s.breaks[def.id] ?? {}), ...patch };
        for (const k of Object.keys(merged)) if (merged[k] === def[k]) delete merged[k];
        if (Object.keys(merged).length) s.breaks[def.id] = merged;
        else delete s.breaks[def.id];
      });
      return effectiveConfig(state).breaks.find((b) => b.id === def.id);
    } catch (err) {
      throw wrap(err);
    }
  }

  async setDayHours(input) {
    try {
      allowKeys(input, ['day', 'start', 'end']);
      const def = DAYS.find((d) => d.day === input.day);
      if (!def) throw new PlannerError('INVALID_INPUT', 'day must be 1 or 2.');
      const patch = {};
      if (input.start !== undefined) patch.start = checkTime(input.start, 'start');
      if (input.end !== undefined) patch.end = checkTime(input.end, 'end');
      if (!Object.keys(patch).length) throw new PlannerError('INVALID_INPUT', 'Provide start and/or end.');
      const state = await this.store.update((s) => {
        const merged = { ...(s.days[String(def.day)] ?? {}), ...patch };
        const eff = { ...def, ...merged };
        if (parseTime(eff.start) >= parseTime(eff.end)) {
          throw new PlannerError('INVALID_INPUT', `Day start (${eff.start}) must be before end (${eff.end}).`);
        }
        for (const k of Object.keys(merged)) if (merged[k] === def[k]) delete merged[k];
        if (Object.keys(merged).length) s.days[String(def.day)] = merged;
        else delete s.days[String(def.day)];
      });
      const eff = effectiveConfig(state).days.find((d) => d.day === def.day);
      return { day: def.day, start: eff.start, end: eff.end };
    } catch (err) {
      throw wrap(err);
    }
  }

  async reset(input) {
    try {
      allowKeys(input, ['scope']);
      const scope = input.scope ?? 'overrides';
      if (scope !== 'overrides' && scope !== 'all') throw new PlannerError('INVALID_INPUT', 'scope must be "overrides" or "all".');
      if (scope === 'all') {
        let movedAside = null;
        try {
          await this.store.read();
        } catch (err) {
          if (err.code !== 'STORAGE_CORRUPT') throw err;
          movedAside = await this.store.quarantine();
        }
        await this.store.update((s) => {
          s.overrides = {};
          s.breaks = {};
          s.days = {};
        });
        return { scope, movedAside };
      }
      await this.store.update((s) => {
        s.overrides = {};
      });
      return { scope };
    } catch (err) {
      throw wrap(err);
    }
  }
}
