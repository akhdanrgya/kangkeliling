import { View, Text, Image } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const SplashScreen = () => {
  return (
    <View style={style.container}>
      <Image
      source={require('@/assets/images/KANGKELILING.jpeg')}
      style={style.image}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor : "#14213D",
    width : '100%',
    height : '100%'
  },

  text : {
    color : "#FCA311",
    fontFamily : "bebas",
    fontSize : 24
  },

  image : {
    height : 300,
    width : 300
  }

});

export default SplashScreen;
