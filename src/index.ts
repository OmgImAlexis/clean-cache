/**
 * Class for objects stored in cache.
 */
class CacheItem<T = any> {
  /** The current value. */
  value: T;
  /** When the item expires. */
  expiresAt: number;

  constructor(value, ttl) {
    this.value = value;
    this.expiresAt = (new Date()).getTime() + ttl;
  }
}

interface CacheOptions {
  /**
   * `true` if the item should be updated.
   *
   * `false` to throw an error.
   */
  overrideOnMatch: boolean
}

/**
 * Class for caching objects in memory based on a key for a given amount of "cache time" (ttl).
 */
class Cache<T = any> {
  items: { [key: string]: CacheItem<T> }

  /**
   * @param ttl Time an item remains in cache (in ms).
   */
  constructor(public ttl: number = 60000, public options: CacheOptions = {
    overrideOnMatch: false
  }) {
    this.items = {};
  }

  /**
   * Adds an object to the cache.
   *
   * Throws an error, if there already is an object under the given key.
   *
   * @param key Key to store the item under
   * @param value The object to store in cache
   */
  add(key: string, value: { [key: string]: any }, ttl = null) {
    // Invalid key
    if (key === null) {
      throw new Error("Can't add object under key 'null'");
    } else if (key === undefined) {
      throw new Error("Can't add object under key 'undefined'");
    }

    // Invalid value
    if (value === null) {
      throw new Error("Can't add 'null' to cache");
    } else if (value === undefined) {
      throw new Error("Can't add 'undefined' to cache");
    }

    // No previous value set
    if (this.items[key] === undefined || this.items[key] === null) {
      this.items[key] = new CacheItem(value, ttl === null ? this.ttl : ttl);
      return;
    }

    // Cache item is still valid
    if (!Cache.isItemInvalid(this.items[key])) {
      if (this.options.overrideOnMatch === false) {
        throw new Error(`There already is an object stored under the key '${key}'`);
      }
    }

    // Cache item is invalid and can be replaced
    this.items[key] = new CacheItem(value, ttl === null ? this.ttl : ttl);
  }

  /**
   * Invalidates an object from the cache.
   * 
   * @param key Key of object to invalidate.
   */
  invalidate(key: string) {
    const value = this.items[key];
    this.items[key] = new CacheItem(value, 0);
  }

  /**
   * Get an object from the cache and returns it. If no object is found
   * for the given key, null is returned instead.
   *
   * @param key Key of object to get.
   */
  get(key: string) {
    if (key === null) {
      throw new Error("Invalid argument 'null'");
    } else if (key === undefined) {
      throw new Error("Invalid argument 'undefined'");
    }

    if (this.items[key] !== undefined && this.items[key] !== null) {
      if (Cache.isItemInvalid(this.items[key])) {
        delete this.items[key]; // remove item from cache
        return null;
      }
      return this.items[key].value;
    }
    return null;
  }

  /**
   * Removes all objects that exceeded their ttl from the cache.
   */
  tidy() {
    Object.keys(this.items).forEach((key) => {
      if (Cache.isItemInvalid(this.items[key])) {
        delete this.items[key]; // remove item from cache
      }
    });
  }

  /**
   * Returns the amount of valid items in the cache.
   */
  count() {
    let count = 0;
    Object.values(this.items).forEach((value) => {
      if (!Cache.isItemInvalid(value)) {
        count += 1;
      }
    });
    return count;
  }

  /**
   * Returns true if item is expired.
   *
   * @param item item to validate
   */
  static isItemInvalid<T = any>(item: CacheItem<T>) {
    if (item === null) {
      throw new Error("Invalid parameter 'null'");
    } else if (item === undefined) {
      throw new Error("Invalid parameter 'undefined'");
    }

    return (new Date()).getTime() >= item.expiresAt;
  }
};

export {
  Cache,
  CacheItem
};