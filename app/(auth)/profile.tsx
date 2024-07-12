import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "@/libs/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

const profile = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, role`)
        .eq("id", session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }

      router.replace("/home");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

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
    <View style={styles.container}>
      <View style={styles.welcomeText}>
        <Text style={styles.title}>Hallo {username}</Text>
      </View>

      <View>
        <Text style={styles.labelText}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <Pressable style={styles.submitButton} onPress={updateProfile}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </Pressable>
      <View style={{marginVertical : 5}}>
      <Button
        onPress={signOut}
        title="Sign Out"
        color="#841584"
        accessibilityLabel="Sign Out"
        />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 150,
  },
  welcomeText: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
  },
  labelText: {
    fontFamily: "Roboto-Regular",
    fontSize: 15,
    marginBottom: 5,
  },

  picker: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  input: {
    backgroundColor: "#D9D9D9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#FCA311",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 15,
    fontFamily: "Roboto-Medium",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default profile;

// import { View, Text, StyleSheet, Button } from "react-native";
// import React, {useState, useEffect} from "react";
// import { supabase } from "@/libs/supabase";
// import { Session } from "@supabase/supabase-js";
// import { useRouter } from "expo-router";

// const profile = () => {
//   const [session, setSession] = useState<Session | null>(null);
//   const router = useRouter()

//   useEffect(() => {
//     const fetchSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       setSession(session);
//       if (!session) {
//         router.replace("/signIn");
//       }
//     };

//     fetchSession();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       if (!session) {
//         router.replace("/signIn");
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [router]);

//   const signOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       setSession(null);
//       router.replace("/signIn");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };
//   return (
//     <View style={Styles.container}>
//       <Button
//         onPress={signOut}
//         title="Sign Out"
//         color="#841584"
//         accessibilityLabel="Sign Out"
//       />
//     </View>
//   );
// };

// const Styles = StyleSheet.create({
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 1,
//   },
// });

// export default profile;
