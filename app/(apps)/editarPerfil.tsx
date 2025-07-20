import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { setId, setName, setEmail, setRole, setUriFoto, setContrasenia } from './redux/store';
import { FontAwesome } from '@expo/vector-icons';

export default function EditarPerfil() {
  interface RootState {
    user: {
      email: string;
      name: string;
      id: number;
      role: string;
      contrasenia: string;
    };
  }

  const email = useSelector((state: RootState) => state.user.email);
  const nombre = useSelector((state: RootState) => state.user.name);
  const contrasenia = useSelector((state: RootState) => state.user.contrasenia);
  const id = useSelector((state: RootState) => state.user.id);
  const role = useSelector((state: RootState) => state.user.role);
  const [nuevoNombre, setNuevoNombre] = useState(nombre);
  const [password, setPassword] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  // Misma regex que en registrar.tsx
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        let endpoint = '';
        
        if (role === "Proveedor") {
          endpoint = `/provedores/${id}`;
        } else if (role === "Cliente") {
          endpoint = `/cliente/buscar/id/${id}`;
        } else {
          setCargando(false);
          return;
        }

        const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + endpoint);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Error al cargar el perfil');
        }

        const data = await response.json();
        setNuevoNombre(data.nombre || data.name || '');
        setCargando(false);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el perfil');
        setCargando(false);
        console.error('Error:', error);
      }
    };

    cargarPerfil();
  }, [id, role]);

  const editarPerfil = async () => {
    // Validación básica
    if (!nuevoNombre && !nuevaPassword) {
      Alert.alert('Error', 'Debes cambiar al menos el nombre o la contraseña');
      return;
    }

    if (nuevoNombre === nombre && !nuevaPassword) {
      Alert.alert('Error', 'No has realizado ningún cambio');
      return;
    }

    // Validar nueva contraseña si se proporciona
    if (nuevaPassword && !passwordRegex.test(nuevaPassword)) {
      Alert.alert(
        'Error',
        'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
      );
      return;
    }

    // Verificar contraseña actual si se quiere cambiar la contraseña
    if (nuevaPassword && password !== contrasenia) {
      Alert.alert('Error', 'La contraseña actual no es correcta');
      return;
    }

    try {
      let endpoint = '';
      let bodyData: any = {};

      if (role === "Proveedor") {
        endpoint = `/provedores/${id}`;
        if (nuevoNombre !== nombre) bodyData.nombre = nuevoNombre;
        if (nuevaPassword) {
          bodyData.contrasenia = nuevaPassword;
          bodyData.currentPassword = password;
        }
      } else if (role === "Cliente") {
        endpoint = `/cliente/actualizar/${id}`;
        if (nuevoNombre !== nombre) bodyData.nombre = nuevoNombre;
        if (nuevaPassword) {
          bodyData.contrasena = nuevaPassword;
          bodyData.currentPassword = password;
        }
      } else {
        Alert.alert('Error', 'Rol no válido');
        return;
      }

      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el perfil');
      }

      const updatedData = await response.json();
      
      if (nuevoNombre !== nombre) {
        dispatch(setName(nuevoNombre));
      }
      
      if (nuevaPassword) {
        dispatch(setContrasenia(nuevaPassword));
      }
      
      const session = await AsyncStorage.getItem('session');
      if (session) {
        const parsedSession = JSON.parse(session);
        const updatedSession = {
          ...parsedSession,
          name: nuevoNombre || parsedSession.name,
        };
        
        if (nuevaPassword) {
          updatedSession.contrasenia = nuevaPassword;
        }

        await AsyncStorage.setItem('session', JSON.stringify(updatedSession));
      }

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      router.push('/perfil');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
      console.error('Error al actualizar:', error);
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
          value={nuevoNombre}
          onChangeText={setNuevoNombre}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña actual (requerida para cambiar contraseña)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña (mín. 8 caracteres, mayúscula, minúscula, número y especial)"
          value={nuevaPassword}
          onChangeText={setNuevaPassword}
          secureTextEntry
        />
        <Pressable style={styles.pressableButton} onPress={editarPerfil}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

export const unstable_settings = { initialRouteName: null };