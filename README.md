# Clean Cache

[![Build Status](https://travis-ci.org/kuper-adrian/clean-cache.svg?branch=master)](https://travis-ci.org/kuper-adrian/clean-cache)
[![Coverage Status](https://coveralls.io/repos/github/kuper-adrian/clean-cache/badge.svg?branch=master)](https://coveralls.io/github/kuper-adrian/clean-cache?branch=master)
[![dependencies Status](https://david-dm.org/kuper-adrian/clean-cache/status.svg)](https://david-dm.org/kuper-adrian/clean-cache)

[![NPM](https://nodei.co/npm/clean-cache.png?compact=true)](https://nodei.co/npm/clean-cache/)

Simple single-file, in-memory javascript cache fully tested and without any dependencies.

Initially part of [statg](https://github.com/kuper-adrian/statg-bot).

## Install
```
npm install clean-cache
```

## Use
```javascript
const { Cache } = require('clean-cache');

const options = {
    // `true` if the item should be updated.
    // `false` to throw an error.
    // Defaults false (throwing an error).
    overrideOnMatch: false
};

const cache = new Cache(30000);             // ttl in ms, if omitted defaults to 60s
const cache = new Cache(30000, options);    // options can be passed

// adding items
cache.add('1', { foo: 'bar' });       // adds object under key '1' for 30s
cache.add('2', { foo: 'bar' }, 1000); // expires in 1s instead of 30s
cache.add(null, { foo: 'bar' });      // throws error (see below)
cache.add(undefined, { foo: 'bar' }); // throws error

// getting items
cache.get('1');                       // returns { foo: 'bar' }
cache.get('non-existent');            // returns null
cache.get(null);                      // throws error
cache.get(undefined);                 // throws error

// other
cache.count();                        // returns number of objects in cache
cache.tidy();                         // removes all expired items from cache
```

## License
MIT