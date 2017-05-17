import { TYPE_ALIASES } from './constants';


import postgresBuildQuery from './search-drivers/postgres';
import mysqlBuildQuery    from './search-drivers/mysql';
import sqliteBuildQuery   from './search-drivers/sqlite';

/*
  Example:

  ```
  import search from 'lux-search'

  index(request, response) {
    return search(
      super.index(request, response),
      request,
      [
        'firstName',
        'address',
        'someNumber',
        ['fullName', ['firstName', 'suffix', 'surName']]
      ]
    );
  }
  ```
 */

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
  ['pg', postgresBuildQuery],
  ['mysql', mysqlBuildQuery],
  ['mysql2', mysqlBuildQuery],
  ['mariasql', mysqlBuildQuery],
  ['sqlite3', sqliteBuildQuery]
]);

export default function search(query, request, columns = []){
  const {
    controller: {
      model
    },
    params: {
      search
    }
  } = request;

  if(search && columns.length){
    const keys = Object.keys(search);

    // map with source search data for multiColumn search
    const multiColumn = new Map();

    // maps with search data per type
    const _text = new Map();
    const _number = new Map();
    const _multiColumn = new Map();

    columns.forEach((item) => {
      if(typeof item === 'string'){   // single col search
        const column = model.columnFor(item);

        if(column){
          // check if a search is performed for the column
          if(keys.includes(item)){
            const { type, columnName } = column;
            const simpleType = TYPE_ALIASES.get(type);

            if(simpleType === 'string'){
              _text.set(columnName, search[item]);
            } else if(simpleType === 'number'){
              _number.set(columnName, search[item]);
            } else {
              throw new Error(`[lux-search] Column type is not (yet) searchable`);
            }
          }
        } else {
          //log debug warning that column doesn't exist
          throw new Error(`[lux-search] Column doesn't exist`);
        }
      } else if(Array.isArray(item)){ // multicol search
        const key = item[0];
        const values = item[1];

        //TODO: assert whether given syntax was right

        if(keys.includes(key)){
          _multiColumn.set(key, search[key]);
          multiColumn.set(key, values);
        }
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
        throw new Error(`[lux-search] Database driver not supported. Please use one of the following: ${Array.from(driverMap.keys()).join(', ')}`);
      }
    }
  }

  // do nothing
  return query;
}
