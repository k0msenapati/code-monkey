import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value
  
  // Check if the user is trying to access dashboard pages
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  
  // Redirect to sign in if trying to access dashboard without being logged in
  if (isDashboardPage && !currentUser) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  // Redirect to dashboard if already logged in and trying to access authentication pages
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') || 
                     request.nextUrl.pathname.startsWith('/sign-up')
                     
  if (isAuthPage && currentUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  // Specify which paths should be processed by this middleware
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
}