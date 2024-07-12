import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import SplashScreen from "./splashScreen";
import { supabase } from "@/libs/supabase";
import { Session } from "@supabase/supabase-js";
import { View } from "react-native";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      clearTimeout(splashTimeout);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!showSplash) {
      if (session && session.user) {
        router.replace('/home');
        console.log("Anjay login")
      } else {
        router.replace('/signIn');
      }
    }
  }, [showSplash, session]);

  return (
    <View>
      {showSplash ? <SplashScreen /> : null}
    </View>
  );
};

export default App;
