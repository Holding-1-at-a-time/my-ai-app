// /lib/rateLimit.ts
import LRU from 'lru-cache';

const rateLimitCache = new LRU<string, { count: number; lastRequest: number }>({
    max: 5000,
    ttl: 60 * 1000, // Time-to-live: 1 minute
});

/**
 * Checks if the key has not exceeded the set limit of requests per minute.
 *
 * @param key - A unique identifier for the client (e.g. IP address).
 * @param limit - Maximum allowed requests per TTL.
 * @returns True if allowed; false if rate limit is exceeded.
 */
export function rateLimit(key: string, limit: number = 5): boolean {
    const now = Date.now();
    const record = rateLimitCache.get(key);
    if (!record) {
        rateLimitCache.set(key, { count: 1, lastRequest: now });
        return true;
    }
    if (now - record.lastRequest < 60 * 1000) {
        if (record.count >= limit) {
            return false;
        } else {
            record.count++;
            rateLimitCache.set(key, record);
            return true;
        }
    }
    // Reset if the time window has passed.
    rateLimitCache.set(key, { count: 1, lastRequest: now });
    return true;
}
