// Private durable state (per-deck overrides) under <COPILOT_HOME>/extension-data/<canvas-id>/.
import { promises as fs } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { BREAKS, DAYS, TIME_RE } from './plan.mjs';

export const FORMAT = 'ia-agentique-timing-planner/state';
export const VERSION = 1;

export class StoreError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export function dataDir(canvasId) {
  const home = process.env.COPILOT_HOME ? process.env.COPILOT_HOME : path.join(os.homedir(), '.copilot');
  return path.join(home, 'extension-data', canvasId);
}

export function emptyState(deckPath) {
  return { format: FORMAT, version: VERSION, deckPath, overrides: {}, breaks: {}, days: {}, updatedAt: null };
}

const isObj = (v) => v != null && typeof v === 'object' && !Array.isArray(v);
const isMinutes = (v) => Number.isInteger(v) && v >= 0 && v <= 600;

function validate(data) {
  if (!isObj(data) || data.format !== FORMAT) return 'unrecognized format marker';
  if (data.version !== VERSION) return `unsupported version ${JSON.stringify(data.version)}`;
  if (typeof data.deckPath !== 'string') return 'missing deckPath';
  if (!isObj(data.overrides) || !Object.entries(data.overrides).every(([k, v]) => /^[A-Za-z_$][\w$]*$/.test(k) && isMinutes(v))) {
    return 'invalid overrides';
  }
  const breakIds = new Set(BREAKS.map((b) => b.id));
  if (!isObj(data.breaks)) return 'invalid breaks';
  for (const [id, b] of Object.entries(data.breaks)) {
    if (!breakIds.has(id) || !isObj(b)) return `invalid break ${id}`;
    if (b.start !== undefined && !TIME_RE.test(b.start)) return `invalid break start for ${id}`;
    if (b.minutes !== undefined && !isMinutes(b.minutes)) return `invalid break minutes for ${id}`;
    if (b.beforePage !== undefined && typeof b.beforePage !== 'string') return `invalid break page for ${id}`;
  }
  const dayIds = new Set(DAYS.map((d) => String(d.day)));
  if (!isObj(data.days)) return 'invalid days';
  for (const [id, d] of Object.entries(data.days)) {
    if (!dayIds.has(id) || !isObj(d)) return `invalid day ${id}`;
    if (d.start !== undefined && !TIME_RE.test(d.start)) return `invalid start for day ${id}`;
    if (d.end !== undefined && !TIME_RE.test(d.end)) return `invalid end for day ${id}`;
  }
  return null;
}

export class PlanStore {
  constructor(canvasId, deckPath) {
    this.deckPath = path.resolve(deckPath);
    const identity = process.platform === 'win32' ? this.deckPath.toLowerCase() : this.deckPath;
    const key = createHash('sha256').update(identity).digest('hex').slice(0, 24);
    this.dir = dataDir(canvasId);
    this.file = path.join(this.dir, `${key}.json`);
  }

  async signature() {
    try {
      const s = await fs.stat(this.file);
      return `${s.mtimeMs}:${s.size}`;
    } catch {
      return 'none';
    }
  }

  async read() {
    let raw;
    try {
      raw = await fs.readFile(this.file, 'utf8');
    } catch (err) {
      if (err.code === 'ENOENT') return emptyState(this.deckPath);
      throw new StoreError('STORAGE_READ_FAILED', `Cannot read planner state ${this.file}: ${err.message}`);
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      throw new StoreError('STORAGE_CORRUPT', `Planner state ${this.file} is not valid JSON (${err.message}). Use reset_plan with scope "all" to move it aside.`);
    }
    const problem = validate(data);
    if (problem) {
      throw new StoreError('STORAGE_CORRUPT', `Planner state ${this.file} is unrecognized: ${problem}. Use reset_plan with scope "all" to move it aside.`);
    }
    return data;
  }

  async write(state) {
    const problem = validate(state);
    if (problem) throw new StoreError('STORAGE_INVALID', `Refusing to write invalid state: ${problem}`);
    try {
      await fs.mkdir(this.dir, { recursive: true });
      const tmp = path.join(this.dir, `.${path.basename(this.file)}.${process.pid}.${randomUUID()}.tmp`);
      await fs.writeFile(tmp, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
      for (let attempt = 0; ; attempt += 1) {
        try {
          await fs.rename(tmp, this.file);
          break;
        } catch (err) {
          if (attempt >= 4 || !['EPERM', 'EACCES', 'EBUSY'].includes(err.code)) {
            await fs.rm(tmp, { force: true });
            throw err;
          }
          await new Promise((r) => setTimeout(r, 25 * (attempt + 1)));
        }
      }
    } catch (err) {
      if (err instanceof StoreError) throw err;
      throw new StoreError('STORAGE_WRITE_FAILED', `Cannot write planner state ${this.file}: ${err.message}`);
    }
  }

  async update(mutate) {
    const state = await this.read();
    mutate(state);
    state.updatedAt = new Date().toISOString();
    await this.write(state);
    return state;
  }

  /** Moves an unreadable state file aside (never deletes it) so a fresh one can be written. */
  async quarantine() {
    const target = this.file.replace(/\.json$/, `.corrupt-${Date.now()}.json`);
    try {
      await fs.rename(this.file, target);
      return target;
    } catch (err) {
      if (err.code === 'ENOENT') return null;
      throw new StoreError('STORAGE_WRITE_FAILED', `Cannot move aside ${this.file}: ${err.message}`);
    }
  }
}
