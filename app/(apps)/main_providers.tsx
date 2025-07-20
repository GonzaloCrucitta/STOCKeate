import React from 'react';
import { useEffect } from 'react'; 
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, Pressable } from 'react-native';
import styles from './styles';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Asegúrate de tener este paquete instalado

interface RootState {
  user: {
    email: string;
    name: string;
    id: number;
  };
}

export default function ProvidersMainApp() {
  const nombre = useSelector((state: RootState) => state.user.name);
  const router = useRouter();
  useFocusEffect(() => {
    if (!nombre) {
      router.replace('/'); // o el path que tengas para login
    }
  }) ;

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainTitle}>¡Bienvenido, {nombre}!</Text>
      <View style={styles.menuGrid}>
        <Pressable style={styles.menuCard} onPress={() => router.push('../stock')}>
          <MaterialCommunityIcons name="warehouse" size={36} color="#2563eb" />
          <Text style={styles.menuCardText}>Stock</Text>
        </Pressable>
        <Pressable style={styles.menuCard} onPress={() => router.push('../movimientos')}>
          <MaterialCommunityIcons name="swap-horizontal" size={36} color="#2563eb" />
          <Text style={styles.menuCardText}>Movimientos</Text>
        </Pressable>
        <Pressable style={styles.menuCard} onPress={() => router.push('../entrante')}>
          <MaterialCommunityIcons name="plus-box" size={36} color="#2563eb" />
          <Text style={styles.menuCardText}>Re Stock</Text>
        </Pressable>
        <Pressable style={styles.menuCard} onPress={() => router.push('../pedidos_pendientes')}>
          <MaterialCommunityIcons name="clipboard-list-outline" size={36} color="#2563eb" />
          <Text style={styles.menuCardText}>Pedidos Pendientes</Text>
        </Pressable>
      </View>
    </View>
  );
}
