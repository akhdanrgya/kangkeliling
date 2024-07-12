import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const SplashScreen = () => {
  return (
    <View style={style.container}>
      <Text style={style.text}>KANGKELILING</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flex: 1,
    backgroundColor : "#14213D"
  },

  text : {
    color : "#FCA311",
    fontFamily : "bebas",
    fontSize : 24
  }

});

export default SplashScreen;
