class CacheService {
  cache = new Map();

  has(key) {
    return this.cache.has(key);
  }

  set(key, value) {
    const setObj = {
      value,
      timestamp: Date.now()
    };
    return this.cache.set(key, setObj);
  }

  get(key) {
    return this.cache.get(key).value;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    return this.cache.clear();
  }

  isExpired(key, seconds) {
    const {timestamp} = this.cache.get(key);

    return (Date.now() - timestamp) / 1000 > seconds;
  }
}

const cacheServiceInstance = new CacheService();

export {
  cacheServiceInstance
}


