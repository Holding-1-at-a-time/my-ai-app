import { LRUCache } from "lru-cache"

type RateLimitOptions = {
  max: number
  ttl: number
}

class RateLimiter {
  private cache: LRUCache<string, number>
  private max: number
  private ttl: number

  constructor(options: RateLimitOptions) {
    this.cache = new LRUCache({
      max: options.max,
      ttl: options.ttl,
    })
    this.max = options.max
    this.ttl = options.ttl
  }

  isWithinLimit(key: string): boolean {
    const count = this.cache.get(key) || 0
    if (count >= this.max) {
      return false
    }

    this.cache.set(key, count + 1)
    return true
  }
}

export const rateLimiter = new RateLimiter({
  max: 5,
  ttl: 60 * 1000, // 1 minute
})

