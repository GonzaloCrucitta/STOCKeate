import React, { useCallback, useState } from 'react';
import { View, Text, Image, Pressable, Alert, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { vaciar, vaciarCarrito } from './redux/store';
import styles from './styles';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function PerfilPage() {
  interface RootState {
    user: {
      email: string;
      name: string;
      id: number;
      role: string;
    };
  }

  const router = useRouter();
  const email = useSelector((state: RootState) => state.user.email);
  const nombre = useSelector((state: RootState) => state.user.name);
  const id = useSelector((state: RootState) => state.user.id);
  const role = useSelector((state: RootState) => state.user.role);
  const dispatch = useDispatch();
  const defaultUri = require('../../components/perfil.png');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      getUri();
    }, [])
  );

  const agregarImagen = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await subirImagen(result.assets[0].uri);
      await getUri();
    }
  };

  const subirImagen = async (uri: string | null) => {
    if (!uri) return;

    try {
      const filename = uri.split('/').pop() || 'imagen.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      const formData = new FormData();
      formData.append('archivo', {
        uri,
        name: filename,
        type,
      } as any);

      const uploadResponse = await fetch(
        `${process.env.EXPO_PUBLIC_URL_SERVIDOR}/foto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await uploadResponse.json();

      if (uploadResponse.ok) {
        const nombreArchivo = result.rutaArchivo.split(/[\\/]/).pop() || '';

        const updateUrl =
          role === 'Proveedor'
            ? `/provedores/${id}`
            : `/cliente/actualizar/${id}`;

        const updateResponse = await fetch(
          `${process.env.EXPO_PUBLIC_URL_SERVIDOR}${updateUrl}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ foto: nombreArchivo }),
          }
        );

        if (!updateResponse.ok) {
          throw new Error('No se pudo actualizar la base de datos con la nueva imagen.');
        }

        await AsyncStorage.removeItem('foto_usuario');
        await AsyncStorage.setItem('foto_usuario', nombreArchivo);
        setImageUri(`${process.env.EXPO_PUBLIC_URL_SERVIDOR}/foto/download/${nombreArchivo}`);
        Alert.alert('Éxito', 'Imagen actualizada correctamente.');
      } else {
        console.error('❌ Error al subir imagen:', result);
        Alert.alert('Error', 'No se pudo subir la imagen.');
      }
    } catch (error) {
      console.error('❌ Error inesperado al subir imagen:', error);
      Alert.alert('Error', 'Hubo un problema al subir la imagen.');
    }
  };

  async function getUri() {
    try {
      const url =
        role === 'Proveedor'
          ? `/provedores/${id}`
          : `/cliente/buscar/id/${id}`;

      const response = await fetch(`${process.env.EXPO_PUBLIC_URL_SERVIDOR}${url}`);

      if (response.ok) {
        const usuario = await response.json();
        const uri_foto = usuario.foto;

        if (uri_foto) {
          await AsyncStorage.setItem('foto_usuario', uri_foto);
          setImageUri(`${process.env.EXPO_PUBLIC_URL_SERVIDOR}/foto/download/${uri_foto}`);
        } else {
          setImageUri(null);
        }
      } else {
        const fallback = await AsyncStorage.getItem('foto_usuario');
        if (fallback) {
          setImageUri(`${process.env.EXPO_PUBLIC_URL_SERVIDOR}/foto/download/${fallback}`);
        } else {
          setImageUri(null);
        }
      }
    } catch (error) {
      console.error('⚠️ Error al obtener foto:', error);
      try {
        const fallback = await AsyncStorage.getItem('foto_usuario');
        if (fallback) {
          setImageUri(`${process.env.EXPO_PUBLIC_URL_SERVIDOR}/foto/download/${fallback}`);
        } else {
          setImageUri(null);
        }
      } catch {
        setImageUri(null);
      }
    }
  }

  async function salir() {
    dispatch(vaciar());
    dispatch(vaciarCarrito());
    await AsyncStorage.clear();
    router.replace('/');
  }

  async function confirmarYBorrarPerfil() {
    console.log('Confirmar y borrar perfil',role);
    const url =
      role === 'Proveedor'
        ? `/provedores/eliminar/${id}`
        : `/cliente/eliminar/${id}`;
    console.log('Confirmar y borrar perfil',role,url);
    Alert.alert(
      'Confirmar',
      '¿Seguro que deseas borrar este perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${process.env.EXPO_PUBLIC_URL_SERVIDOR}${url}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                await AsyncStorage.clear();
                dispatch(vaciar());
                dispatch(vaciarCarrito());
                router.replace('/');
              } else {
                const errorText = await response.text();
                Alert.alert('Error', errorText || 'No se pudo borrar el perfil');
              }
            } catch (error) {
              Alert.alert('Error', 'Problema de conexión');
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={agregarImagen}>
        <Image
          source={imageUri ? { uri: imageUri } : defaultUri}
          style={styles.profileImage}
        />
      </Pressable>

      <Text style={styles.profileName}>{nombre}</Text>
      <Text style={styles.profileEmail}>Email: {email}</Text>
      <Text style={styles.profileEmail}>Rol: {role}</Text>

      <Pressable style={styles.pressableButton} onPress={salir}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </Pressable>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        <Pressable
          style={[styles.pressableButton, {
            backgroundColor: '#fbbf24',
            marginRight: 8,
            paddingVertical: 10,
            paddingHorizontal: 18,
            minWidth: 0,
          }]}
          onPress={() => router.push({ pathname: '/editarPerfil', params: { id } })}
        >
          <Text style={[styles.buttonText, { fontSize: 14, color: '#1e293b', textTransform: 'none' }]}>
            Editar Perfil
          </Text>
        </Pressable>

        <Pressable
          style={[styles.pressableButton, {
            backgroundColor: '#ef4444',
            paddingVertical: 10,
            paddingHorizontal: 18,
            minWidth: 0,
          }]}
          onPress={confirmarYBorrarPerfil}
        >
          <Text style={[styles.buttonText, { fontSize: 14 }]}>Borrar Perfil</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

