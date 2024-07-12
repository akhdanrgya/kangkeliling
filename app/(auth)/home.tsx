import { View, StyleSheet, Alert, Image, Text } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/libs/supabase";
import { useRouter } from "expo-router";
import { Session } from "@supabase/supabase-js";
import MapView, { Marker, PROVIDER_DEFAULT, Circle } from "react-native-maps";
import * as Location from "expo-location";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface LocationObjectCoords {
  latitude: number;
  longitude: number;
}

interface Pedagang {
  id: string;
  latitude: number;
  longitude: number;
  idPedagang: string;
  namaDagangan: string;
  rating: number;
}

interface UserProfile {
  id: string;
  latitude: number;
  longitude: number;
}

interface subPedagang {
  idPedagang: string;
  namaDagangan: string;
  rating: number;
}

interface Produk {
  idProduk: string;
  namaProduk: string;
  deskripsi: string;
  harga: number;
}


const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] =
    useState<LocationObjectCoords | null>(null);
  const router = useRouter();
  const [pedagang, setPedagang] = useState<Pedagang[] | null>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[] | null>(null);
  const [subPedagang, setSubPedagang] = useState<subPedagang[] | null>(null);

  const sheetRef = useRef<BottomSheet>(null);
  const [openBottom, setOpenBottom] = useState(false);
  const [selectedPedagang, setSelectedPedagang] = useState<Pedagang | null>(
    null
  );
  const [produk, setProduk] = useState<Produk[] | null>(null);

  const izinLokasi = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let lokasiSekarang = await Location.getCurrentPositionAsync({});
      setCurrentLocation(lokasiSekarang.coords);

      const userId = session?.user.id;
      if (!userId) return;

      const { latitude, longitude } = lokasiSekarang.coords;
      const insert = {
        longitude: longitude,
        latitude: latitude,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(insert)
        .eq("id", userId);

      if (error) {
        console.log("Error insert data:", error);
      } else {
        console.log("Berhasil insert data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLocation = async (newLocation: LocationObjectCoords) => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("latitude, longitude")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user location:", error);
        return;
      }

      // const dbLocation = parsePoint(data.location);
      const dbLatitude = data.latitude;
      const dbLongitude = data.longitude;
      const { latitude, longitude } = newLocation;

      if (latitude !== dbLatitude || longitude !== dbLongitude) {
        const update = {
          longitude: longitude,
          latitude: latitude,
          updated_at: new Date(),
        };

        const { error: updateError } = await supabase
          .from("profiles")
          .update(update)
          .eq("id", session.user.id);

        if (updateError) {
          console.error("Error updating location:", updateError);
        } else {
          console.log("Location updated successfully");
        }
      }
      console.log(`${session.user.email}`, latitude, longitude);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        router.replace("/signIn");
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.replace("/signIn");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (session) {
      izinLokasi();
    }
  }, [session]);

  useEffect(() => {
    const watchLocation = async () => {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        (location) => {
          setCurrentLocation(location.coords);
          updateLocation(location.coords);
        }
      );
    };

    if (session) {
      watchLocation();
    }
  }, [session]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const { data: user } = await supabase.auth.getUser();
          setUser(user);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    const checkUsername = async () => {
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", session.user.id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            setUsername(data.username || null);
          }

          if (data.username === null) {
            router.replace("/onBoarding");
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };

    checkUsername();
  }, [session]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      router.replace("/signIn");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const fetchPedagang = async () => {
    try {
      const { data: pedagangData, error: pedagangError } = await supabase
        .from("profiles")
        .select("id, latitude, longitude")
        .eq("role", "pedagang");

      if (pedagangError) {
        throw pedagangError;
      }

      const { data: subPedagangData, error: subPedagangError } = await supabase
        .from("pedagang")
        .select("idPedagang, namaDagangan, rating, idprofiles");

      if (subPedagangError) {
        throw subPedagangError;
      }

      if (!subPedagangData) {
        throw new Error("subPedagangData is null");
      }

      const pedagangCombined: Pedagang[] = pedagangData.map((pedagangItem) => {
        const subPedagangItem = subPedagangData.find(
          (subItem) => subItem.idprofiles === pedagangItem.id
        );

        return {
          id: pedagangItem.id,
          latitude: pedagangItem.latitude,
          longitude: pedagangItem.longitude,
          idPedagang: subPedagangItem?.idPedagang,
          namaDagangan: subPedagangItem?.namaDagangan,
          rating: subPedagangItem?.rating,
        };
      });

      setPedagang(pedagangCombined);

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, latitude, longitude")
        .eq("role", "user");

      if (userError) {
        throw userError;
      }

      setUserProfiles(userData as UserProfile[]);
    } catch (error) {
      console.error("Fetch pedagang error:", error);
    }
  };

  useEffect(() => {
    const fetchSubPedagang = async () => {
      try {
        const { data, error } = await supabase
          .from("pedagang")
          .select("idPedagang, namaDagangan, rating");

        if (error) throw error;

        setSubPedagang(data);
        console.log("subPedagang: ", data);
      } catch (error) {
        console.error("Fetch subPedagang error:", error);
      }
    };

    fetchSubPedagang();
  }, [pedagang]);

  const calculateAverageLocation = (locations: UserProfile[] | null) => {
    if (!locations || locations.length === 0)
      return { latitude: 0, longitude: 0 };

    const total = locations.reduce(
      (acc, loc) => {
        return {
          latitude: acc.latitude + loc.latitude,
          longitude: acc.longitude + loc.longitude,
        };
      },
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: total.latitude / locations.length,
      longitude: total.longitude / locations.length,
    };
  };

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel("public:profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          console.log("Change received!", payload);

          if (payload.eventType === "UPDATE") {
            setUserProfiles(
              (prevProfiles) =>
                prevProfiles?.map((profile) =>
                  profile.id === payload.new.id
                    ? {
                        ...profile,
                        latitude: payload.new.latitude,
                        longitude: payload.new.longitude,
                      }
                    : profile
                ) || null
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchPedagang();
    }
  }, [session]);

  const averageLocation = calculateAverageLocation(userProfiles);

  const snapPoint = ["20%","40%", "90%"];

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const { data, error } = await supabase
          .from("Produk")
          .select("idProduk, namaProduk, deskripsi, harga")
          .eq("idPedagang", selectedPedagang?.idPedagang);

        if (error) throw error;

        setProduk(data as Produk[]);
      } catch (error) {
        console.error("Fetch produk error:", error);
      }
    };

    if (selectedPedagang) {
      fetchProduk();
    }
  }, [selectedPedagang]);

  return (
    <GestureHandlerRootView>
      <View style={Styles.container}>
        <MapView
          style={Styles.map}
          provider={PROVIDER_DEFAULT}
          showsUserLocation={true}
          followsUserLocation={true}
          region={{
            latitude: currentLocation?.latitude || 0,
            longitude: currentLocation?.longitude || 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {pedagang?.map((pedagangItem) => (
            <>
              {pedagangItem.id !== session?.user.id ? (
                <Marker
                  key={pedagangItem.id}
                  coordinate={{
                    latitude: pedagangItem.latitude,
                    longitude: pedagangItem.longitude,
                  }}
                  title={pedagangItem.namaDagangan}
                  description="Lokasi Pedagang"
                  onPress={() => {
                    setSelectedPedagang(pedagangItem);
                    setOpenBottom(!openBottom);
                  }}
                >
                  <Image
                    source={require("@/assets/images/defaultAvatar.jpg")}
                    style={Styles.avatar}
                  />
                </Marker>
              ) : null}
            </>
          ))}
          {averageLocation.latitude !== 0 &&
            averageLocation.longitude !== 0 && (
              <Circle
                center={averageLocation}
                radius={100}
                strokeWidth={2}
                strokeColor="rgba(85, 255, 0, 0.37)"
                fillColor="rgba(85, 255, 0, 0.37)"
              />
            )}
        </MapView>
        {openBottom && selectedPedagang && (
          <BottomSheet ref={sheetRef} snapPoints={snapPoint}>
            <BottomSheetScrollView>
              <View style={Styles.bawah}>
                <View style={Styles.bawahTitle}>
                  <Text style={Styles.title}>
                    {selectedPedagang.namaDagangan}
                  </Text>
                </View>
                {produk?.map((produkItem) => (
                  <View key={produkItem.idProduk} style={Styles.pedagangCard}>
                    <Text style = {Styles.produkTitle}>{produkItem.namaProduk}</Text>
                    <Text>{produkItem.deskripsi}</Text>
                    <Text style={Styles.produkHarga}>Rp.{produkItem.harga}</Text>
                  </View>
                ))}
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const Styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },

  bawah: {
    alignItems: "center",
    height: "100%",
  },
  bawahTitle: {
    padding: 20,
  },

  title: {
    fontSize: 40,
  },

  pedagangCard: {
    backgroundColor: "#D9D9D9",
    width: 300,
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
    justifyContent : 'center',
    marginVertical : 15
  },

  pedagangCardItems: {
    justifyContent: "center",
    alignItems: "center",
  },

  produkTitle : {
    fontSize : 20,
    marginVertical : 10
  },

  produkHarga : {
    fontSize : 20,
    marginVertical : 10
  }
});

export default App;
