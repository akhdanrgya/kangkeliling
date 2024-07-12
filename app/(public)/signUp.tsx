import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/libs/supabase";
import { Session } from "@supabase/supabase-js";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session && session.user) {
    router.replace("/home");
  }

  async function signInWithEmail() {
    console.log({ email, password });
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);

    setLoading(false);
    router.replace("/home");
    
  }

  async function signUpWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);

    signInWithEmail();
  }

  return (
    <>
      {loading ? (
        <View>
          <Text>Loading</Text>
        </View>
      ) : (
        <View style={Styles.container}>
          <View style={Styles.textContainer}>
            <Text style={Styles.welcome}>Hello</Text>
            <Text style={Styles.hello}>Create an account to continue</Text>
          </View>

          <Text style={Styles.labelText}>Email Address</Text>
          <TextInput
            style={Styles.input}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />

          <Text style={Styles.labelText}>Password</Text>
          <TextInput
            style={Styles.input}
            value={password}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />

          <Pressable style={Styles.loginAccount} onPress={signUpWithEmail}>
            <Text style={Styles.loginAccountText}>Create an Account</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

const Styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 150,
    display: "flex",
    flex: 1,
  },
  welcome: {
    fontFamily: "Roboto-medium",
    fontSize: 30,
  },
  hello: {
    fontFamily: "Roboto-Light",
    fontSize: 15,
  },
  textContainer: {
    padding: 10,
    marginVertical: 10,
    paddingBottom: 200,
  },
  bar: {
    backgroundColor: "#14213D",
    marginVertical: 10,
    flexDirection: "row",
    paddingVertical: 15,
    borderRadius: 50,
  },
  barText: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    flex: 1,
    color: "white",
    fontFamily: "Roboto-Regular",
    fontSize: 18,
  },
  labelText: {
    fontFamily: "Roboto-Regular",
    fontSize: 15,
  },
  input: {
    backgroundColor: "#D9D9D9",
    padding: 20,
    borderRadius: 50,
    margin: 10,
  },
  loginAccount: {
    backgroundColor: "#FCA311",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 30,
    borderRadius: 50,
  },
  loginAccountText: {
    fontSize: 15,
    fontFamily: "Roboto-Medium",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  successText: {
    color: "green",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
});

export default SignUp;
