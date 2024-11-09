import { Redis } from "@upstash/redis"
import { NextRequest } from "next/server"

const RATE_LIMIT_REQUESTS = 10 // requests
const RATE_LIMIT_WINDOW = 60 // seconds

const redis = Redis.fromEnv()

export async function rateLimit(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1"
  const key = `rate-limit:${ip}`

  const [response] = await redis.pipeline().incr(key).expire(key, RATE_LIMIT_WINDOW).exec()

  const currentRequests = response as number

  if (currentRequests > RATE_LIMIT_REQUESTS) {
    return false
  }

  return true
}
