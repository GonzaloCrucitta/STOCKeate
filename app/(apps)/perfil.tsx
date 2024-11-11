import React, { useEffect, useState } from 'react'; 
import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { vaciar, vaciarCarrito } from './redux/store';
import styles from './styles';

interface RootState {
  user: {
    email: string;
    name: string;
    id: number;
    role: string;
  };
}

export default function PerfilPage() {

  const email = useSelector((state: RootState) => state.user.email);
  const nombre = useSelector((state: RootState) => state.user.name);
  const id = useSelector((state: RootState) => state.user.id);
  const role = useSelector((state: RootState) => state.user.role);
  const dispatch = useDispatch();
  const defaultUri = '../../components/perfil.png'; // URI de imagen por defecto
  const [imageUri, setImageUri] = useState('');
  useEffect(() => { getUri() }, []);

  async function getUri() {
    try {
      const response = await fetch("http://localhost:4000/provedores/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('No hay respuesta del servidor al pedir foto');
      }
      const usuario = await response.json();
      var uri_foto = usuario.foto;
    } catch (error) {
      console.error('Error al obtener foto:', error);
    }
    console.log('uri del usuario:' + uri_foto);
    const serverUri = 'http://localhost:4000/foto/download/' + uri_foto;
    try {
      const response = await fetch(serverUri);
      if (response.ok) {
        setImageUri(serverUri);
      } else {
        setImageUri(defaultUri);
      }
    } catch (error) {
      setImageUri(defaultUri);
    }
  }
  
  function salir() {
    // Vaciar tanto la información del usuario como el carrito
    dispatch(vaciar());
    dispatch(vaciarCarrito());
    console.log("Rol: " + role);
    router.push('/');
  }

  return (
    <View style={styles.container}>
      {/* Imagen del perfil */}
      <Image
        source={{ uri: imageUri || defaultUri }} // Reemplaza con la ruta de tu imagen
        style={styles.profileImage}
      />

      {/* Información del perfil */}
      <Text style={styles.profileName}>{nombre}</Text>
      <Text style={styles.profileEmail}>email: {email}</Text>
      <Text style={styles.profileEmail}>id: {id}</Text>

      {/* Botón de cerrar sesión */}
      <Pressable style={styles.pressableButton} onPress={() => salir()}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}

function setData(data: any): any {
  throw new Error('Function not implemented.');
}
