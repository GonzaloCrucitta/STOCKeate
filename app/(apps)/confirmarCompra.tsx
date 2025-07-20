import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { vaciarCarrito } from './redux/store';
import styles from './styles';

const ConfirmarCompra: React.FC = () => {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const id_cliente = useSelector((state: any) => state.user.id);
  const carrito = useSelector((state: any) => state.carrito.items);

  // Función para formatear automáticamente la fecha MM/AA
  const handleFechaChange = (text: string) => {
    // Eliminar cualquier caracter que no sea número
    let cleanedText = text.replace(/[^0-9]/g, '');
    
    // Limitar a 4 dígitos (MMAA)
    if (cleanedText.length > 4) {
      cleanedText = cleanedText.substring(0, 4);
    }
    
    // Insertar "/" después de los primeros 2 dígitos
    if (cleanedText.length > 2) {
      cleanedText = `${cleanedText.substring(0, 2)}/${cleanedText.substring(2)}`;
    }
    
    setFechaVencimiento(cleanedText);
  };

  // Validar formato de fecha MM/AA
  const validarFecha = (fecha: string) => {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    return regex.test(fecha);
  };

  const handleProcesarCompra = async () => {
    if (!numeroTarjeta || !fechaVencimiento || !cvv) {
      Alert.alert('Error', 'Por favor ingresa todos los datos de la tarjeta.');
      return;
    }

    if (!validarFecha(fechaVencimiento)) {
      Alert.alert('Error', 'Formato de fecha inválido. Use MM/AA');
      return;
    }

    try {
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
        dispatch(vaciarCarrito());
      } else {
        Alert.alert('Error', data.error || 'Error al procesar el pedido');
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
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
        maxLength={16}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Fecha de vencimiento (MM/AA)"
        value={fechaVencimiento}
        onChangeText={handleFechaChange}
        keyboardType="number-pad"
        maxLength={5}
      />
      
      <TextInput
        style={styles.input}
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
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