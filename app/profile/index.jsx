import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const Profile = () => {
  return (
    <View style={styles.container}>
      <Text>profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flex: 1,
  },
});

export default Profile;
