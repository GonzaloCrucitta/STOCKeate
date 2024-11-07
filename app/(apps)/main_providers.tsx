import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import styles from './styles';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

// Definir los tipos para el estado global de Redux
interface RootState {
  user: {
    email: string;
  };
}

export default function ProvidersMainApp() {
  // Acceder al email del estado global con useSelector y el tipo adecuado
  const email = useSelector((state: RootState) => state.user.email);

  const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>({
    stock: true,
    movements: false,
    newEntry: false,
    newExit: false,
    reports: false,
    pendingOrders: false,
  });

  const toggleModal = (section: string) => {
    setModalVisible((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>{email}</Text>
      <Pressable style={styles.pressableButton} onPress={() => router.push('../stock')}>
        <Text style={styles.buttonText}>Stock</Text>
      </Pressable>
      <Pressable style={styles.pressableButton} onPress={() => toggleModal('movements')}>
        <Text style={styles.buttonText}>Movimientos</Text>
      </Pressable>
      <Pressable style={styles.pressableButton} onPress={() => router.push('../entrante')}>
        <Text style={styles.buttonText}>Re Stock</Text>
      </Pressable>
      <Pressable style={styles.pressableButton} onPress={() => router.push('../saliente')}>
        <Text style={styles.buttonText}>Venta</Text>
      </Pressable>
      <Pressable style={styles.pressableButton} onPress={() => router.push('../pedidos_pendientes')}>
        <Text style={styles.buttonText}>Pedidos Pendientes</Text>
      </Pressable>
    </View>
  );
}
