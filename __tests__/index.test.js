import {underscore} from "inflection";

import search from "../lib/index";

describe('search', () => {
  const query = {
    whereRaw: jest.fn().mockImplementation((queryString, queryValues) => ({
      queryString,
      queryValues
    }))
  };

  const model = {
    tableName: 'test_table',
    columnFor: jest.fn().mockImplementation((column) => ({
      'type': 'varchar',
      'columnName': underscore(column)
    })),
    store: {
      config: {}
    }
  };

  test('does not work when an unsupported driver is used', () => {
    model.store.config.driver = 'fake_driver';

    const request = {
      controller: {
        model: model
      },
      params: {
        'search': {
          'name': 'John Doe'
        }
      }
    };

    const columns = ['name'];

    expect(() => {
      search(query, request, columns)
    }).toThrowError(`[lux-search] Database driver not supported. Please use one of the following: pg, mysql, mysql2, mariasql, sqlite3`);
  });

  test('gracefully skips if no search param is present', () => {
    model.store.config.driver = 'pg';

    const request = {
      controller: {
        model: model
      },
      params: {}
    };

    const columns = ['name'];

    expect(search(query, request, columns)).toEqual(query);
  });

  test('gracefully skips if no columns are present', () => {
    model.store.config.driver = 'pg';

    const request = {
      controller: {
        model: model
      },
      params: {
        'search': {
          'name': 'John Doe'
        }
      }
    };

    const columns = [];

    expect(search(query, request, columns)).toEqual(query);
  });
});
