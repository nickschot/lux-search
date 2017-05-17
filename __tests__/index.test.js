import {underscore} from "inflection";

import search from "../lib/index";

describe('search', () => {
  const query = {
    whereRaw: jest.fn().mockImplementation((queryString, queryValues) => ({
      queryString,
      queryValues
    }))
  };

  test('does not work when an unsupported driver is used', () => {
    const model = {
      tableName: 'test_table',
      columnFor: jest.fn().mockImplementation((column) => ({
        'type': 'varchar',
        'columnName': underscore(column)
      })),
      store: {
        config: {
          driver: 'fake_driver'
        }
      }
    };

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
});
