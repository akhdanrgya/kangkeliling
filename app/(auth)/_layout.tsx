import React, { useState, useEffect } from "react";
import { Tabs, Stack } from "expo-router";
import { supabase } from "@/libs/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
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
        <Tabs>
          <Tabs.Screen
            name="profile"
            options={{
              headerShown: false,
              title: "Profile",
              tabBarShowLabel : false,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="user" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="home"
            options={{
              headerShown: false,
              title: "Home",
              tabBarShowLabel : false,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="globe" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              headerShown: false,
              title: "Explore",
              tabBarShowLabel : false,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="compass" color={color} size={size} />
              ),
            }}
          />
        </Tabs>
      ) : null}
    </>
  );
};

export default _layout;
