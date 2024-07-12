import React from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";

const OnBoardHeader = () => {
  return (
    <View style={Styles.container}>
      <View style={Styles.bar}>
        <Link href={"/signIn"} style={Styles.barText}>
          Sign in
        </Link>
        <Link href={"/signUp"} style={Styles.barText}>
          Sign up
        </Link>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    display: "flex"
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
});

export default OnBoardHeader;
