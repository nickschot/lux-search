export default function buildQuery(query, tableName, _searchText, _searchInt, _searchMultiCol, searchMultiCol){
  let queryArr = [];
  let queryValues = [];

  _searchText.forEach((value, key) => {
    queryArr.push(`${tableName}.${key} ILIKE ?`);
    queryValues.push(`%${value}%`);
  });

  _searchInt.forEach((value, key) => {
    queryArr.push(`CAST(${tableName}.${key} AS TEXT) LIKE ?`);
    queryValues.push(`${value}%`);
  });

  _searchMultiCol.forEach((value, key) => {
    let cols = searchMultiCol[key].map((value) => `coalesce(${snakeCase(value)}, '')`);
    queryArr.push(cols.join(` || `) + ' ILIKE ?');
    // remove whitespaces from search string
    queryValues.push(`%${value.replace(/\s/g, '')}%`);
  });

  let queryString = queryArr.join(' AND ');

  // add search query
  return query.whereRaw(queryString, queryValues);
}
