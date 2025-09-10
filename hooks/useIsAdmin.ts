import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/auth-helpers-nextjs';

export function useIsAdmin(session: Session | null) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkAdmin() {
      if (!session?.user?.id) {
        setIsAdmin(false);
        return;
      }

      // Only check the "users" table where admins are stored
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin:', error.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data?.is_admin);
      }
    }

    checkAdmin();
  }, [session, supabase]);

  return isAdmin;
}
