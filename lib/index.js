import snakeCase from 'lodash.snakecase';

import postgresBuildQuery from './search-drivers/postgres';

/*
 pg
 sqlite3
 mysql
 mysql2
 mariasql
 strong-oracle
 oracle
 mssql
 */
const driverMap = new Map([
  ['pg', postgresBuildQuery]
]);

export default function search(request, query, options){
  const {
    controller: {
      model
    },
    params: {
      search
    }
  } = request;

  if(search){
    const keys = Object.keys(search);

    const {
      text = [],
      number = [],
      multiColumn = {}
    } = options;

    const _text = new Map();
    text.forEach((key) => {
      if(keys.includes(key)){
        _text.set(snakeCase(key), search[key]);
      }
    });

    const _number = new Map();
    number.forEach((key) => {
      if(keys.includes(key)){
        _number.set(snakeCase(key), search[key]);
      }
    });

    const _multiColumn = new Map();
    Object.keys(multiColumn).forEach((key) => {
      if(keys.includes(key)){
        _multiColumn.set(key, search[key]);
      }
    });

    if(_text.size || _number.size || _multiColumn.size){
      const {
        tableName,
        store: {
          config: {
            driver
          }
        }
      } = model;

      if(driverMap.has(driver)){
        return driverMap.get(driver)(query, tableName, _text, _number, _multiColumn, multiColumn);
      } else {
        //TODO: log debug level warning if driver is not supported
        throw new Error(`[lux-search] Database driver not supported. Please use one of the following: ${driverMap.keys().join(', ')}`);
      }
    }
  }

  // do nothing
  return query;
}
