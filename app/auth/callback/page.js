'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function handleOAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // CHECK DOMAIN
      if (!user.email.endsWith('@up.edu.ph')) {
        await supabase.auth.signOut();

        alert('Only UP Mail accounts are allowed.');

        router.push('/signup');
        return;
      }

      // CHECK IF PROFILE EXISTS
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      // CREATE PROFILE IF NONE
      if (!existingProfile) {
        const fullName = user.user_metadata.full_name || '';

        const nameParts = fullName.split(' ');

        const firstName = user.user_metadata.given_name || nameParts[0] || '';

        const lastName =user.user_metadata.family_name || nameParts.slice(1).join(' ') || '';

        await supabase.from('profiles').insert({
        id: user.id,

        username: user.email,

        avatar_url:
            user.user_metadata.avatar_url || '',

        first_name: firstName,

        last_name: lastName,
        });
      }

      router.push('/');
    }

    handleOAuth();
  }, []);

  

  return <p>Signing in with UP Mail...</p>;
}