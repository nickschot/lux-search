import { underscore } from 'inflection';

export default function buildQuery(query, tableName, _text, _number, _multiColumn, multiColumn){
  const queryArr = [];
  const queryValues = [];

  _text.forEach((value, key) => {
    queryArr.push(`${tableName}.${key} ILIKE ?`);
    queryValues.push(`%${value}%`);
  });

  _number.forEach((value, key) => {
    queryArr.push(`CAST(${tableName}.${key} AS TEXT) LIKE ?`);
    queryValues.push(`${value}%`);
  });

  _multiColumn.forEach((value, key) => {
    const cols = multiColumn.get(key).map((value) => `coalesce(${underscore(value)}, '')`);

    queryArr.push(cols.map(col => `${tableName}.${col}`).join(` || `) + ' ILIKE ?');
    // remove whitespaces from search string
    queryValues.push(`%${value.replace(/\s/g, '')}%`);
  });

  const queryString = queryArr.join(' AND ');

  // add search query
  return query.whereRaw(queryString, queryValues);
}
