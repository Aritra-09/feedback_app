import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt";
 
export async function proxy(request: NextRequest) {

    const token = await getToken({req: request})
    const url = request.nextUrl;

    if(token && 
        (url.pathname.startsWith('/signin')|| 
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/dashboard') 
        )) {

         return NextResponse.redirect(new URL(`${url.pathname}`, request.url))
    }

    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/signin', request.url))
    }
        
  return NextResponse.redirect(new URL('/', request.url))
}
 
// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    // '/signin',
    // '/signup',
  ]
}
