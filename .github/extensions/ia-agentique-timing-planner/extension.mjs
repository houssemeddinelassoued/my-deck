import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CanvasError, createCanvas, joinSession } from '@github/copilot-sdk/extension';
import { DECK_ID, summarizePlan } from './plan.mjs';
import { startServer } from './server.mjs';
import { Planner } from './service.mjs';
import { ACTION_SCHEMAS } from './schemas.mjs';

const CANVAS_ID = 'ia-agentique-timing-planner';
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const DECK_PATH = path.join(REPO_ROOT, 'slides', DECK_ID, 'index.tsx');

const planner = new Planner(CANVAS_ID, DECK_PATH);
const instances = new Map();
let session;

const log = (message, level = 'info') => session?.log(`[${CANVAS_ID}] ${message}`, { level, ephemeral: true }).catch(() => {});

async function guard(fn) {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof CanvasError) throw err;
    throw new CanvasError(err.code ?? 'INTERNAL', err.message ?? String(err));
  }
}

async function afterMutation(result) {
  await Promise.all([...instances.values()].map(async (p) => (await p.catch(() => null))?.notify()));
  const plan = await planner.view();
  return { result, plan: summarizePlan(plan) };
}

const canvas = createCanvas({
  id: CANVAS_ID,
  displayName: 'Minutage · IA agentique',
  description: 'Timing planner for the 2-day ia-agentique-feuille-de-route deck, built from the ⏱ durations in its speaker notes.',
  actions: [
    {
      name: 'get_plan',
      description: 'Return the computed schedule: per-day end time and overrun, module planned vs computed start, budget vs content, and break slack. Set includePages for page-level timings.',
      inputSchema: ACTION_SCHEMAS.get_plan,
      handler: ({ input }) =>
        guard(async () => {
          const i = input ?? {};
          if (i.day !== undefined && i.day !== 1 && i.day !== 2) throw new CanvasError('INVALID_INPUT', 'day must be 1 or 2.');
          const plan = await planner.view();
          return summarizePlan(plan, { day: i.day, includePages: i.includePages === true });
        }),
    },
    {
      name: 'set_page_minutes',
      description: 'Override the planned duration of one page (by 1-based index or component name). minutes=null restores the value from the speaker notes. Does not edit the deck.',
      inputSchema: ACTION_SCHEMAS.set_page_minutes,
      handler: ({ input }) => guard(async () => afterMutation(await planner.setPageMinutes(input ?? {}))),
    },
    {
      name: 'set_break',
      description: 'Adjust a break: planned start "HH:MM", duration in minutes, and/or the page it is taken before.',
      inputSchema: ACTION_SCHEMAS.set_break,
      handler: ({ input }) => guard(async () => afterMutation(await planner.setBreak(input ?? {}))),
    },
    {
      name: 'set_day_hours',
      description: 'Change the start and/or end time ("HH:MM") of day 1 or day 2.',
      inputSchema: ACTION_SCHEMAS.set_day_hours,
      handler: ({ input }) => guard(async () => afterMutation(await planner.setDayHours(input ?? {}))),
    },
    {
      name: 'reset_plan',
      description: 'Clear page-duration overrides (scope "overrides") or every customization including breaks and day hours (scope "all").',
      inputSchema: ACTION_SCHEMAS.reset_plan,
      handler: ({ input }) => guard(async () => afterMutation(await planner.reset(input ?? {}))),
    },
  ],
  open: ({ instanceId }) =>
    guard(async () => {
      const plan = await planner.view();
      let server = await instances.get(instanceId);
      if (!server || !server.isListening()) {
        const starting = startServer(planner, log);
        instances.set(instanceId, starting);
        try {
          server = await starting;
        } catch (err) {
          instances.delete(instanceId);
          throw new CanvasError('SERVER_START_FAILED', `Could not start the planner server: ${err.message}`);
        }
      }
      const late = plan.days.filter((d) => d.endDelta > 0).map((d) => `J${d.day} +${d.endDelta} min`);
      return {
        url: server.url,
        title: 'Minutage · IA agentique',
        status: late.length ? `Dépassement : ${late.join(', ')}` : 'Dans les temps',
      };
    }),
  onClose: async ({ instanceId }) => {
    const pending = instances.get(instanceId);
    instances.delete(instanceId);
    const server = await pending?.catch(() => null);
    await server?.close();
  },
});

session = await joinSession({ canvases: [canvas] });
