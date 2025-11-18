import type { DBProfile } from "../types/db";
import { profileColumns } from "../utils/profile";
import { supabase } from "../supabase";
import { unstable_batchedUpdates } from "react-dom";
import { useAuthStore } from "../store/auth";
import { useEffect } from "react";

export function Auth() {
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;

      const session = data.session;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        clear();
      }
    });

    return () => {
      isMounted = false;

      data.subscription.unsubscribe();
    };
  }, []);

  return null;
}

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("user_id", userId)
    .single();

  const setProfile = useAuthStore.getState().setProfile;

  if (error) {
    setProfile(null);
  } else {
    setProfile(data as unknown as DBProfile);
  }

  unstable_batchedUpdates(() => {
    useAuthStore.getState().setIsLoading(false);
  });
}
