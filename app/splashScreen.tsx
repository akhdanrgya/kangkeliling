import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const SplashScreen = () => {
  return (
    <View>
      <Text style={style.text}>KANGKELILING</Text>
    </View>
  );
};

const style = StyleSheet.create({

  text : {
    color : "#FCA311",
    fontFamily : "bebas",
    fontSize : 24
  }


});

export default SplashScreen;
