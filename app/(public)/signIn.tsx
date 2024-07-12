import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/libs/supabase";
import { Session } from "@supabase/supabase-js";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter()


  async function signInWithEmail() {
    console.log({ email, password });
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
  }

    useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (session && session.user) {
    router.replace('/home')
  }

  return (
    <View style={Styles.container}>
      <View style={Styles.textContainer}>
        <Text style={Styles.welcome}>Welcome</Text>
        <Text style={Styles.hello}>Hello there, Log in to continue</Text>
      </View>
      <Text style={Styles.labelText}>Username or Email</Text>
      <TextInput
        style={Styles.input}
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <Text style={Styles.labelText}>Password</Text>
      <TextInput
        style={Styles.input}
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
      />
      <Link href={"/"} style={Styles.forgotPassword}>
        Forgot Password?
      </Link>
      
      <Pressable style={Styles.loginAccount} onPress={signInWithEmail}>
        <Text style={Styles.loginAccountText}>Login Account</Text>
      </Pressable>
    </View>
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

  forgotPassword: {
    color: "#14213D",
    fontSize: 15,
    textAlign: "right",
    marginVertical: 10,
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
});

export default SignIn;
