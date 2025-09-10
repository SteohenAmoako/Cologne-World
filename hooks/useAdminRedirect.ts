import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAdmin } from './useIsAdmin';

export function useAdminRedirect(session: any) {
  const isAdmin = useIsAdmin(session);
  const router = useRouter();

  useEffect(() => {
    if (isAdmin === false) {
      router.push('/');
    }
  }, [isAdmin, router]);

  return isAdmin;
}
