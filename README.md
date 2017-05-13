# lux-search
Search util for [Lux](https://github.com/postlight/lux).

## Install

    $ npm i --save lux-search

## Usage

### Drivers
lux-redis-cache comes with two (optional) cache engines. They are outlined below. For all engines you can optionally set an explicit expiration time by passing the expiresIn option to the `getFromRedis` method. When using one of the cache engines it is recommended to set an automatic eviction policy like `allkeys-lru` in redis with this engine so everything will continue to work when redis is filled up.

## Example

## Related Modules

## Tests

    $ npm install
    $ npm test

## License
This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
