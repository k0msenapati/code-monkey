import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value
  
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  
  if (isDashboardPage && !currentUser) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') || 
                     request.nextUrl.pathname.startsWith('/sign-up')
                     
  if (isAuthPage && currentUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
}