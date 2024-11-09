import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';

interface RootState {
  user: {
    email: string;
    name: string;
    id: number;  // Aquí debes usar 'number' en lugar de 'int' en TypeScript
  };
}

export default function PerfilPage() {

  const email = useSelector((state: RootState) => state.user.email);
  const nombre = useSelector((state: RootState) => state.user.name);
  const id= useSelector((state: RootState) => state.user.id);
  const defaultUri = '../../components/perfil.png'; // URI de imagen por defecto
  const [imageUri, setImageUri] = useState('');
  useEffect(() => {getUri()}, []);

  async function getUri() {
    const serverUri = 'https://n89crwvh-4000.brs.devtunnels.ms/foto/download/archivo-20241012_221457.png';
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
  //const [foto,setFoto]=useState(null);
  //const [id,setId]=useState(0)
  
 /*  useEffect(() => {
    fetch('https://n89crwvh-4000.brs.devtunnels.ms/foto/download')
    .then(response=> response.json())
    .then(data => setData(data));
  }) */


  return (
    <View style={styles.container}>
      {/* Imagen del perfil */}
      <Image
        
        source={{uri: imageUri || defaultUri}} // Reemplaza con la ruta de tu imagen
        style={styles.profileImage}
      />

      {/* Información del perfil */}
      <Text style={styles.profileName}>{nombre}</Text>
      <Text style={styles.profileEmail}>email: {email}</Text>
      <Text style={styles.profileEmail}>id: {id}</Text>
    
      

      {/* Botón de cerrar sesión */}
      <Pressable style={styles.pressableButton} onPress={() => router.push('../')}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}
function setData(data: any): any {
  throw new Error('Function not implemented.');
}

