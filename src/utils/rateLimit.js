const buckets = new Map();

function hit(key, limit, windowMs) {
  const now = Date.now();
  const bucket = buckets.get(key) || [];
  const fresh = bucket.filter((time) => now - time < windowMs);
  if (fresh.length >= limit) {
    buckets.set(key, fresh);
    return { limited: true, retryAfter: windowMs - (now - fresh[0]) };
  }
  fresh.push(now);
  buckets.set(key, fresh);
  return { limited: false, retryAfter: 0 };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, times] of buckets) {
    const fresh = times.filter((time) => now - time < 10 * 60 * 1000);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}, 60 * 1000).unref();

module.exports = { hit };
