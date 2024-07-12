import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import Dropdown from "@/components/DropDown";
import React, { useState, useEffect } from "react";
import { supabase } from "@/libs/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

const OnBoarding = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
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
        setRole(data.role);
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
        role,
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.replace("/signIn");
  };

  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeText}>
        <Text style={styles.title}>Welcome To Kangkeliling</Text>
      </View>

      <View>
        <Text style={styles.labelText}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.labelText}>Role</Text>
        <Dropdown
          data={[
            { value: "pedagang", label: "Pedagang" },
            { value: "user", label: "User" }
          ]}
          onChange={(item) => handleRoleChange(item.value)}
          placeholder="Select Role"
        />
      </View>

      <Pressable style={styles.submitButton} onPress={updateProfile}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </Pressable>
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

export default OnBoarding;
