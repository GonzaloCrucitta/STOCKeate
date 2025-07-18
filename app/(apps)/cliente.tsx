import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

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
  const handleVerEstadoPedido = () => {
    router.push('../estadoPedidoCliente');
  };

  return (
    <LinearGradient
      colors={['#e0e7ff', '#f6f8fa', '#f0fff4']}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.containerCliente}>
        <View style={styles.clienteCard}>
          <Text style={styles.clienteTitle}>¡Bienvenido!</Text>
          <Text style={styles.clienteNombre}>{nombre}</Text>
          <View style={styles.clienteBotonesContainer}>
            <Pressable style={styles.clienteBotonAzul} onPress={handleComprar}>
              <Text style={styles.clienteBotonTexto}>
                IR A LA{'\n'}COMPRA
              </Text>
            </Pressable>
            <Pressable style={styles.clienteBotonVerde} onPress={handleVerEstadoPedido}>
              <Text style={styles.clienteBotonTexto}>
                VER ESTADO{'\n'}DEL PEDIDO
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ClientePage;