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
    columnFor: jest.fn().mockImplementation((column) => {
      let type = 'varchar';

      if(column === 'firstName'){
        type = 'varchar';
      } else if(column === 'age'){
        type = 'integer'
      }

      return {
        'type': type,
        'columnName': underscore(column)
      };
    }),
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
          'firstName': 'John'
        }
      }
    };

    const columns = ['firstName'];

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

    const columns = ['firstName'];

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
          'firstName': 'John'
        }
      }
    };

    const columns = [];

    expect(search(query, request, columns)).toEqual(query);
  });

  test('searches for text', () => {
    model.store.config.driver = 'pg';

    const request = {
      controller: {
        model: model
      },
      params: {
        'search': {
          'firstName': 'John'
        }
      }
    };

    const columns = ['firstName'];

    expect(search(query, request, columns)).toEqual({
      'queryString': 'test_table.first_name ILIKE ?',
      'queryValues': ['%John%']});
  });

  test('searches for numbers', () => {
    model.store.config.driver = 'pg';

    const request = {
      controller: {
        model: model
      },
      params: {
        'search': {
          'age': 3
        }
      }
    };

    const columns = ['age'];

    expect(search(query, request, columns)).toEqual({
      'queryString': 'CAST(test_table.age AS TEXT) LIKE ?',
      'queryValues': ['3%']});
  });

  test('searches multi column', () => {
    model.store.config.driver = 'pg';

    const request = {
      controller: {
        model: model
      },
      params: {
        'search': {
          'fullName': 'John Do'
        }
      }
    };

    const columns = [['fullName', ['firstName', 'suffix', 'lastName']]];

    expect(search(query, request, columns)).toEqual({
      'queryString': `coalesce(first_name, '') || coalesce(suffix, '') || coalesce(last_name, '') ILIKE ?`,
      'queryValues': ['%JohnDo%']});
  });

  test('searches combined', () => {
    model.store.config.driver = 'pg';

    const request = {
      controller: {
        model: model
      },
      params: {
        'search': {
          'firstName': 'John',
          'fullName': 'John Do',
          'age': 3
        }
      }
    };

    const columns = [
      'firstName',
      'age',
      ['fullName', ['firstName', 'suffix', 'lastName']]
    ];

    expect(search(query, request, columns)).toEqual({
      'queryString': `test_table.first_name ILIKE ? AND CAST(test_table.age AS TEXT) LIKE ? AND coalesce(first_name, '') || coalesce(suffix, '') || coalesce(last_name, '') ILIKE ?`,
      'queryValues': ['%John%', '3%', '%JohnDo%']});
  });
});
