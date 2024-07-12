import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/libs/supabase";

interface Pedagang {
  idPedagang: string;
  namaDagangan: string;
  rating: number;
}

const Explore = () => {
  const [pedagang, setPedagang] = useState<Pedagang[]>([]);

  useEffect(() => {
    fetchPedagang();
  }, []);

  const fetchPedagang = async () => {
    try {
      const { data, error } = await supabase
        .from("pedagang")
        .select("idPedagang, namaDagangan, rating");

      if (error) {
        throw error;
      }

      if (data) {
        setPedagang(data as Pedagang[]);
      }
    } catch (error) {
      console.error("Error fetching pedagang:", error);
    }
  };

  return (
    <SafeAreaView>
      <View style={Styles.container}>
        {pedagang.map((item, index) => (
          <View key={index} style={Styles.pedagangCard}>
            <View style={Styles.pedagangCardItems}>
              <View style={Styles.pedagangAvatarNama}>
                <Image
                  source={require("@/assets/images/defaultAvatar.jpg")}
                  style={Styles.avatar}
                />
                <Text>{item.namaDagangan}</Text>
              </View>
            </View>
          </View>
        ))}
        <Text>explore</Text>
      </View>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    flex: 1,
  },

  pedagangCard: {
    backgroundColor: "#D9D9D9",
    width: 350,
    height: 100,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    marginVertical: 15
  },

  pedagangAvatarNama: {
    flexDirection: "row",
    padding: 5,
  },

  pedagangCardItems: {
    flexDirection: "row",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 10,
  },
});

export default Explore;
