import { CONSTANTS } from "@/lib/constants"
import { Redis } from "@upstash/redis"
import { ipAddress } from "@vercel/functions"
import { NextRequest } from "next/server"

const redis = Redis.fromEnv()

export async function rateLimit(request: NextRequest) {
  const ip = ipAddress(request) ?? "127.0.0.1"
  const key = `rate-limit:${ip}`

  const [response] = await redis.pipeline().incr(key).expire(key, CONSTANTS.RATE_LIMIT.WINDOW).exec()

  const currentRequests = response as number

  if (currentRequests > CONSTANTS.RATE_LIMIT.MAX) {
    return false
  }

  return true
}
