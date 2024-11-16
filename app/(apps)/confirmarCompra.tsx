import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { vaciarCarrito } from './redux/store'; // Asegúrate de que la ruta es correcta
import styles from './styles';

const ConfirmarCompra: React.FC = () => {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  // Obtener id_cliente y carrito de Redux
  const id_cliente = useSelector((state: any) => state.user.id);
  const carrito = useSelector((state: any) => state.carrito.items);

  // Función para procesar la compra y enviar el pedido al servidor
  const handleProcesarCompra = async () => {
    if (!numeroTarjeta || !fechaVencimiento || !cvv) {
      Alert.alert('Error', 'Por favor ingresa todos los datos de la tarjeta.');
      return;
    }

    try {
      // Crear el formato de productos para el pedido
      const productos = carrito.map((producto: any) => ({
        id_producto: producto.id_producto,
        cantidad: producto.cantidad,
      }));

      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+'/crearpedidos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cliente,
          productos,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMensajeConfirmacion('¡Su pedido ha sido enviado!');
        
        // Vaciar el carrito después de confirmar la compra
        dispatch(vaciarCarrito());
      } else {
        Alert.alert('Error', data.error || 'Error al procesar el pedido');
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  const handleVolver = () => {
    router.push('/cliente');
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Confirmar Compra</Text>

      <TextInput
        style={styles.input}
        placeholder="Número de tarjeta"
        value={numeroTarjeta}
        onChangeText={setNumeroTarjeta}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de vencimiento (MM/AA)"
        value={fechaVencimiento}
        onChangeText={setFechaVencimiento}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        keyboardType="numeric"
        secureTextEntry
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Procesar Compra" onPress={handleProcesarCompra} />
      </View>

      {mensajeConfirmacion && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: 'green' }}>{mensajeConfirmacion}</Text>
        </View>
      )}

      
    </ScrollView>
  );
};

export default ConfirmarCompra;
