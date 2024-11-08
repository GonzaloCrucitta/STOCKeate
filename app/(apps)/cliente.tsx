import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles';

const ClientePage = () => {
  const router = useRouter();

  const handleComprar = () => {
    router.push('../comprarPage');
  };

  const handleLogout = () => {
    router.push('/');  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.nombreCliente}>Cliente: Juan Pérez</Text>

      <Button title="Ir a la Compra" onPress={handleComprar} />
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

export default ClientePage;



