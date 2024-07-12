import { View, Text, StyleSheet, Button } from "react-native";
import React, {useState, useEffect} from "react";
import { supabase } from "@/libs/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

const profile = () => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter()


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
  }, [router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      router.replace("/signIn");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <View style={Styles.container}>
      <Button
        onPress={signOut}
        title="Sign Out"
        color="#841584"
        accessibilityLabel="Sign Out"
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default profile;
