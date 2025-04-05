import { CONSTANTS } from "@/lib/constants"
import { Redis } from "@upstash/redis"
import { ipAddress } from "@vercel/functions"
import { NextRequest } from "next/server"
const redis = Redis.fromEnv()

const extractAbbreviation = (input: string) => {
  input = input.toLowerCase().replace(/\s+/g, " ")
  const reg = /[\s\-_.,;:]/

  input = reg.test(input)
    ? input
        .split(reg)
        .filter((p) => p)
        .map((p) => p[0])
        .join("")
        .substring(0, 3)
    : input.substring(0, 3)

  return input
}

export async function rateLimit(request: NextRequest) {
  const ip = ipAddress(request) ?? "127.0.0.1"
  const key = `${extractAbbreviation(process.env.NEXT_PUBLIC_APP_NAME!)}-rate-limit:${ip}`

  const [response] = await redis.pipeline().incr(key).expire(key, CONSTANTS.RATE_LIMIT.WINDOW).exec()

  const currentRequests = response as number
  if (currentRequests > CONSTANTS.RATE_LIMIT.MAX) return false

  return true
}
