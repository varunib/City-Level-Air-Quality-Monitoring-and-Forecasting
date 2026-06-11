const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL:    parseInt(process.env.CACHE_TTL_SECONDS) || 600,
  checkperiod: 120,
  useClones: false,
});

const get  = (key)        => cache.get(key);
const set  = (key, value) => cache.set(key, value);
const del  = (key)        => cache.del(key);
const flush = ()          => cache.flushAll();
const stats = ()          => cache.getStats();

module.exports = { get, set, del, flush, stats };
