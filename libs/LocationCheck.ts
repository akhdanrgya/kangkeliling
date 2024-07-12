import { useState, useEffect } from 'react';
import { supabase } from '@/libs/supabase';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

interface LocationObjectCoords {
  latitude: number;
  longitude: number;
}

interface LocationCheckProps {
  session: Session;
}

export function LocationCheck({ session }: LocationCheckProps) {
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<LocationObjectCoords | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let lokasiSekarang = await Location.getCurrentPositionAsync({});
        setCurrentLocation(lokasiSekarang.coords);

        const userId = session?.user.id;
        const { data, error } = await supabase
          .from('profiles')
          .select('location')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user location:', error);
          return;
        }

        const { latitude: dbLatitude, longitude: dbLongitude } = parsePoint(data.location);

        const { latitude, longitude } = lokasiSekarang.coords;
        if (latitude !== dbLatitude || longitude !== dbLongitude) {
          const update = {
            location: `POINT(${longitude} ${latitude})`,
            updated_at: new Date()
          };

          const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update(update)
            .eq('id', userId)
            .select();

          if (updateError) {
            console.error('Error updating location:', updateError);
          } else {
            console.log('Location updated successfully:', updateData);
          }
        }

        console.log("Current location: ", lokasiSekarang);

      } catch (error) {
        console.error("Error getting location: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();



  }, [session]);

  const parsePoint = (pointString: string) => {
    const match = pointString.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (!match) return { latitude: null, longitude: null };
    return { longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) };
  };
}
