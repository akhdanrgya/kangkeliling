import React, { useState, useEffect } from "react";
import { Stack, Tabs } from "expo-router";
import { supabase } from "@/libs/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

const _layout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        router.replace("/signIn");
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.replace("/signIn");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {session && session.user ? (
        <Stack>
          <Stack.Screen name="onBoarding" options={{ headerShown: false }} />
        </Stack>
      ) : null}
    </>
  );
};

export default _layout;
