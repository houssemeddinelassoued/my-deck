// JSON Schemas for the canvas actions.
import { BREAKS } from './plan.mjs';

const time = { type: 'string', pattern: '^([01]?\\d|2[0-3]):[0-5]\\d$', description: 'Time as "HH:MM".' };
const pageRef = {
  description: '1-based page index or page component name (e.g. "M1b_ReAct").',
  oneOf: [{ type: 'integer', minimum: 1 }, { type: 'string', minLength: 1 }],
};

export const ACTION_SCHEMAS = {
  get_plan: {
    type: 'object',
    additionalProperties: false,
    properties: {
      day: { type: 'integer', enum: [1, 2], description: 'Limit to one day.' },
      includePages: { type: 'boolean', description: 'Include per-page start/end times.' },
    },
  },
  set_page_minutes: {
    type: 'object',
    additionalProperties: false,
    required: ['page', 'minutes'],
    properties: {
      page: pageRef,
      minutes: {
        description: 'Planned minutes for the page, or null to restore the ⏱ value from the speaker notes.',
        oneOf: [{ type: 'integer', minimum: 0, maximum: 240 }, { type: 'null' }],
      },
    },
  },
  set_break: {
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
      id: { type: 'string', enum: BREAKS.map((b) => b.id) },
      start: time,
      minutes: { type: 'integer', minimum: 0, maximum: 180 },
      beforePage: pageRef,
    },
  },
  set_day_hours: {
    type: 'object',
    additionalProperties: false,
    required: ['day'],
    properties: {
      day: { type: 'integer', enum: [1, 2] },
      start: time,
      end: time,
    },
  },
  reset_plan: {
    type: 'object',
    additionalProperties: false,
    properties: {
      scope: { type: 'string', enum: ['overrides', 'all'], default: 'overrides' },
    },
  },
};
