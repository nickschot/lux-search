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
      searchText = [],
      searchInt = [],
      searchMultiCol = {}
    } = options;

    const _searchText = new Map();
    searchText.forEach((key) => {
      if(keys.includes(key)){
        _searchText.set(snakeCase(key), search[key]);
      }
    });

    const _searchInt = new Map();
    searchInt.forEach((key) => {
      if(keys.includes(key)){
        _searchInt.set(snakeCase(key), search[key]);
      }
    });

    const _searchMultiCol = new Map();
    Object.keys(searchMultiCol).forEach((key) => {
      if(keys.includes(key)){
        _searchMultiCol.set(key, search[key]);
      }
    });

    if(_searchText.size || _searchInt.size || _searchMultiCol.size){
      const {
        tableName,
        store: {
          config: {
            driver
          }
        }
      } = model;

      console.log(query);

      if(driverMap.has(driver)){
        return driverMap.get(driver)(query, tableName, _searchText, _searchInt, _searchMultiCol, searchMultiCol);
      } else {
        //TODO: log debug level warning if driver is not supported
        throw new Error('[lux-search] Database driver not supported');
      }
    }
  }

  // do nothing
  return query;
}
