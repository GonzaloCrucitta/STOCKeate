import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './styles';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function AgregarPerfil() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  const agregarPerfil = async () => {
    if (!nombre || !email || !role) {
      Alert.alert('Campos incompletos', 'Por favor completá todos los campos');
      return;
    }

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + '/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, role }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Perfil agregado', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        const errorText = await response.text();
        console.log('Respuesta no OK:', errorText);
        Alert.alert('Error', 'No se pudo agregar el perfil');
      }
    } catch (error) {
      console.error('Error en fetch agregar perfil:', error);
      Alert.alert('Error', 'Problema de conexión');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f6f8fa' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container_articulo, { maxWidth: 400, alignSelf: 'center', paddingTop: 40 }]}>
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            left: 16,
            top: 16,
            zIndex: 10,
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f6f8fa'
          }}
        >
          <FontAwesome size={28} name="reply" color="#2563eb" />
        </Pressable>
        <Text style={styles.mainTitle}>Agregar Perfil</Text>
        <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Rol" value={role} onChangeText={setRole} />
        <Pressable style={styles.pressableButton} onPress={agregarPerfil}>
          <Text style={styles.buttonText}>Agregar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

export const unstable_settings = { initialRouteName: null };