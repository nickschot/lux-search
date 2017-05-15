//TODO: check if this map is complete for all databases (mainly postgres)
export const TYPE_ALIASES = new Map([
  ['enu', 'array'],
  ['enum', 'array'],

  ['json', 'object'],
  ['jsonb', 'object'],

  ['binary', 'buffer'],

  ['bool', 'boolean'],
  ['boolean', 'boolean'],

  ['time', 'date'],
  ['date', 'date'],
  ['datetime', 'date'],

  ['text', 'string'],
  ['uuid', 'string'],
  ['string', 'string'],
  ['varchar', 'string'],
  ['character varying', 'string'],

  ['int', 'number'],
  ['float', 'number'],
  ['integer', 'number'],
  ['decimal', 'number'],
  ['floating', 'number'],
  ['bigInteger', 'number']
]);
