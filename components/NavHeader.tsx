'use client';

import { useIsAdmin } from '@/hooks/useIsAdmin';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NavHeader() {
  const [session, setSession] = useState<any>(null);
  const supabase = createClientComponentClient();
  const isAdmin = useIsAdmin(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, [supabase.auth]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Perfume Palace
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/shop" className="hover:text-gray-600">
            Shop
          </Link>
          {session && (
            <>
              <Link href="/profile" className="hover:text-gray-600">
                Profile
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}