import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles';
import { useSelector } from 'react-redux';

interface RootState {
  user: {
    email: string;
    name: string;
    id: number;  // Aquí debes usar 'number' en lugar de 'int' en TypeScript
  };
}



const ClientePage = () => {
  const router = useRouter();
  const nombre = useSelector((state: RootState) => state.user.name);
  const handleComprar = () => {
    router.push('../comprarPage');
  };

  const handleLogout = () => {
    router.push('/');  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.nombreCliente}>Cliente:{nombre}
      </Text>

      <Button title="Ir a la Compra" onPress={handleComprar} />
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

export default ClientePage;



