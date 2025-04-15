import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        secureCookie: true, // CHECK: depends upon http / https
    })
    // console.log("Token --> ", token)
    const route = request.nextUrl.pathname

    if(token && (route.startsWith("/sign") || route.startsWith("/verify"))){
        return NextResponse.redirect(new URL("/", request.url))
    }
    if(!token && route.startsWith("/dashboard")){
        return NextResponse.redirect(new URL("/signin", request.url))
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/signin', '/signup', '/', '/verify/:path*'],
}