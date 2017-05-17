# lux-search
Search util for [Lux](https://github.com/postlight/lux).

[![Build Status](https://travis-ci.org/nickschot/lux-search.svg?branch=master)](https://travis-ci.org/nickschot/lux-search) [![Coverage Status](https://coveralls.io/repos/github/nickschot/lux-search/badge.svg?branch=master)](https://coveralls.io/github/nickschot/lux-search?branch=master) [![Dependency Status](https://david-dm.org/nickschot/lux-search.svg)](https://david-dm.org/nickschot/lux-search) [![npm version](https://badge.fury.io/js/lux-search.svg)](https://badge.fury.io/js/lux-search)

__IMPORTANT:__ This util requires Lux 1.2.0+.

## Install

    $ npm i --save lux-search

## Usage
Lux-search can be used to substring search a single or multiple columns whereas number columns are searched left to right. The util is meant to be used in the index action or a custom action. It will extend the (knex) query with a whereRaw call.

### search(query, request, options)
- **query** - An instance of knex'es query object or a super call to a Lux'es super.index;
- **request** - The request object passed into the action in which search is used
- **options** - Options Array. Can either contain a string or a 2D array for multi-column search. See the example below.


### Example
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
  
And an accompanying example request:
  
```
  GET localhost:4000/?search[fullName]=SomeSubstr&search[someNumber]=123
```

NOTE: characters must of course be properly URL encoded.

### Drivers
The aim is to support database drivers as supported by Lux.

Currently supported database drivers are:

#### Postgres
- pg

#### Sqlite
- sqlite3

NOTE: A case insensitive collation must be used

#### Mysql/Mariadb
- mysql
- mysql2
- mariasql

NOTE: A case insensitive collation must be used

#### Others
Other drivers which are to be supported in the near future are:
- strong-oracle
- oracle
- mssql

## Related Modules

## Tests

    $ npm install
    $ npm test

## License
This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
