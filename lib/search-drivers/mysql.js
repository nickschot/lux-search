//TODO: note that a case insensitive collation must be used
export default function buildQuery(query, tableName, _text, _number, _multiColumn, multiColumn){
  const queryArr = [];
  const queryValues = [];

  _text.forEach((value, key) => {
    queryArr.push(`${tableName}.${key} LIKE ?`);
    queryValues.push(`%${value}%`);
  });

  _number.forEach((value, key) => {
    queryArr.push(`CAST(${tableName}.${key} AS CHAR) LIKE ?`);
    queryValues.push(`${value}%`);
  });

  _multiColumn.forEach((value, key) => {
    const cols = multiColumn.get(key);

    queryArr.push(`CONCAT_WS('',${cols.join(`,`)}) LIKE ?`);
    // remove whitespaces from search string
    queryValues.push(`%${value.replace(/\s/g, '')}%`);
  });

  const queryString = queryArr.join(' AND ');

  // add search query
  return query.whereRaw(queryString, queryValues);
}
