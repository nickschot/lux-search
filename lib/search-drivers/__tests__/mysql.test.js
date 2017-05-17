import buildQuery from '../mysql';

describe('mysql query builder', () => {
  const query = {
    whereRaw: jest.fn().mockImplementation((queryString, queryValues) => ({ queryString, queryValues }))
  };

  const tableName = 'test_table';

  test('generates the correct text query', () => {
    const _text = new Map([['text_column', 'example search']]);
    const _number = new Map();
    const _multiColumn = new Map();
    const multiColumn = new Map();

    const result = buildQuery(query, tableName, _text, _number, _multiColumn, multiColumn);

    expect(result.queryString).toBe('test_table.text_column LIKE ?');
    expect(result.queryValues).toContain('%example search%');
  });

  test('generates the correct number query', () => {
    const _text = new Map();
    const _number = new Map([['number_column', '123']]);
    const _multiColumn = new Map();
    const multiColumn = new Map();

    const result = buildQuery(query, tableName, _text, _number, _multiColumn, multiColumn);

    expect(result.queryString).toBe('CAST(test_table.number_column AS CHAR) LIKE ?');
    expect(result.queryValues).toContain('123%');
  });

  test('generates the correct multi column query', () => {
    const _text = new Map();
    const _number = new Map();
    const _multiColumn = new Map([
      ['fullName', 'John dOe']
    ]);
    const multiColumn = new Map([
      ['fullName', ['firstName', 'suffix', 'lastName']]
    ]);

    const result = buildQuery(query, tableName, _text, _number, _multiColumn, multiColumn);

    expect(result.queryString).toBe(`CONCAT_WS('',firstName,suffix,lastName) LIKE ?`);
    expect(result.queryValues).toContain('%JohndOe%');
  });
});
