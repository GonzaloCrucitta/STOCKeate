import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles';
import { useSelector } from 'react-redux';

interface RootState {
  user: {
    name: string;
  };
}



const ClientePage = () => {
  const router = useRouter();
  const nombre = useSelector((state: RootState) => state.user.name);
  const handleComprar = () => {
    router.push('../comprarPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.nombreCliente}>Cliente:{nombre}
      </Text>

      <Button title="Ir a la Compra" onPress={handleComprar} />
    </View>
  );
};

export default ClientePage;



