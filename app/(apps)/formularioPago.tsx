import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import styles from './styles';

const FormularioPago = ({ route }: any) => {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [cvv, setCvv] = useState('');
  const [fechaExp, setFechaExp] = useState('');

  const procesarPago = () => {
    if (numeroTarjeta && cvv && fechaExp) {
      Alert.alert("Pago exitoso", "Su pedido será enviado pronto");
    } else {
      Alert.alert("Error", "Por favor complete todos los campos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pago para: {route.params.item}</Text>
      <TextInput
        style={styles.input}
        placeholder="Número de tarjeta"
        value={numeroTarjeta}
        onChangeText={setNumeroTarjeta}
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
      <TextInput
        style={styles.input}
        placeholder="Fecha de expiración (MM/AA)"
        value={fechaExp}
        onChangeText={setFechaExp}
        keyboardType="numeric"
      />
      <Button title="Confirmar Pago" onPress={procesarPago} />
    </View>
  );
};

export default FormularioPago;

