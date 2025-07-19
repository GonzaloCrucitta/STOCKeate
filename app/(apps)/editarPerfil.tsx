import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './styles';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function EditarPerfil() {
  const { id } = useLocalSearchParams();
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + '/usuarios/' + id)
      .then(async res => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setNombre(data.nombre || '');
        } catch (e) {
          Alert.alert('Error', 'No se pudo cargar el perfil. Respuesta inesperada del servidor.');
        }
        setCargando(false);
      })
      .catch(() => {
        Alert.alert('Error', 'No se pudo conectar al servidor');
        setCargando(false);
      });
  }, [id]);

  const editarPerfil = async () => {
    if (!nombre) {
      Alert.alert('Campos incompletos', 'El nombre es obligatorio.');
      return;
    }
    const body: { nombre: string; password?: string } = { nombre };
    if (password) body.password = password;

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + '/usuarios/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        Alert.alert('¡Éxito!', 'Los cambios han sido guardados!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        const errorText = await response.text();
        Alert.alert('Error', errorText || 'No se pudo editar el perfil');
      }
    } catch (error) {
      Alert.alert('Error', 'Problema de conexión');
    }
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f8fa' }}>
        <Text style={{ color: '#64748b', fontSize: 18 }}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f6f8fa' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container_articulo, { maxWidth: 400, alignSelf: 'center', paddingTop: 40 }]}>
        {/* Flecha de volver a la derecha, negra */}
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            right: 16,
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
          <FontAwesome size={28} name="reply" color="#000" />
        </Pressable>
        <Text style={styles.mainTitle}>Editar Perfil</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña (opcional)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable style={styles.pressableButton} onPress={editarPerfil}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// Oculta la barra de navegación/tab bar
export const unstable_settings = { initialRouteName: null };