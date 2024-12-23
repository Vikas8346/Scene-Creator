import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_URLS } from '@/constants/urls';
import { isProfileComplete, isUserConfirmed } from '@/helpers/metaDataChecker';

export async function updateSession(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
    }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {data, error} = await supabase.auth.getUser();

  console.log(request.nextUrl.pathname)

  console.log(!AUTH_URLS.includes(request.nextUrl.pathname))

  if (!AUTH_URLS.includes(request.nextUrl.pathname) && data.user && !isProfileComplete(data.user)) {
    return NextResponse.redirect(new URL('/auth/complete-profile', request.url));
  }

  return response
}
