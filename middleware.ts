import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check auth status
  const { data: { session } } = await supabase.auth.getSession();

  // Check if trying to access admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_admin) {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*']
};
