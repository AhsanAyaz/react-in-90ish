import Memcached from 'memcached';

const MEMCACHED_SERVERS = process.env.MEMCACHED_SERVERS || 'localhost:11211';
const CACHE_ENABLED = process.env.CACHE_ENABLED !== 'false'; // Enabled by default

class Cache {
  constructor() {
    if (CACHE_ENABLED) {
      this.client = new Memcached(MEMCACHED_SERVERS, {
        retries: 3,
        retry: 10000,
        remove: true,
        failOverServers: ['localhost:11211']
      });
      console.log(`[Cache] Memcached initialized at ${MEMCACHED_SERVERS}`);
    } else {
      this.client = null;
      console.log('[Cache] Caching disabled');
    }
  }

  /**
   * Get value from cache
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async get(key) {
    if (!this.client) return null;

    return new Promise((resolve) => {
      this.client.get(key, (err, data) => {
        if (err || !data) {
          return resolve(null);
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          console.error('[Cache] Parse error:', e);
          resolve(null);
        }
      });
    });
  }

  /**
   * Set value in cache
   * @param {string} key
   * @param {any} value
   * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
   * @returns {Promise<boolean>}
   */
  async set(key, value, ttl = 300) {
    if (!this.client) return false;

    return new Promise((resolve) => {
      try {
        const data = JSON.stringify(value);
        this.client.set(key, data, ttl, (err) => {
          if (err) {
            console.error('[Cache] Set error:', err);
            return resolve(false);
          }
          resolve(true);
        });
      } catch (e) {
        console.error('[Cache] Stringify error:', e);
        resolve(false);
      }
    });
  }

  /**
   * Delete value from cache
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async del(key) {
    if (!this.client) return false;

    return new Promise((resolve) => {
      this.client.del(key, (err) => {
        if (err) {
          console.error('[Cache] Delete error:', err);
          return resolve(false);
        }
        resolve(true);
      });
    });
  }

  /**
   * Helper: Get or set value in cache
   * @param {string} key
   * @param {Function} fn - Async function to execute on cache miss
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<any>}
   */
  async getOrSet(key, fn, ttl = 300) {
    // Try cache first
    const cached = await this.get(key);
    if (cached !== null) {
      console.log(`[Cache] HIT: ${key}`);
      return cached;
    }

    // Cache miss - execute function
    console.log(`[Cache] MISS: ${key}`);
    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }
}

const cache = new Cache();

export default cache;
