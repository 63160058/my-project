import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

// export { default } from "next-auth/middleware"


export const config = { matcher: ["/"] }