'use client';

import { useIsAdmin } from '@/hooks/useIsAdmin';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminNav() {
  const [session, setSession] = useState<any>(null);
  const supabase = createClientComponentClient();
  const isAdmin = useIsAdmin(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, [supabase.auth]);

  if (!isAdmin) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Link
        href="/admin"
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        Admin Dashboard
      </Link>
    </div>
  );
}