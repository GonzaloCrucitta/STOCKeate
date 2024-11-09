import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; 
import styles from './styles';

const ConfirmarCompra: React.FC = () => {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const router = useRouter();

  const handleProcesarCompra = () => {
    if (!numeroTarjeta || !fechaVencimiento || !cvv) {
      alert('Por favor ingresa todos los datos de la tarjeta.');
      return;
    }


    setTimeout(() => {
      setMensajeConfirmacion('¡Su pedido ha sido Enviado!');
    }, 2000); 
  };

  const handleVolver = () => {
    router.back(); 
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

      <View style={{ marginTop: 20 }}>
        <Button title="Volver a la compra" onPress={handleVolver} />
      </View>
    </ScrollView>
  );
};

export default ConfirmarCompra;
