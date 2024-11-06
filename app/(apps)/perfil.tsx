import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';






export default function PerfilPage() {
  
  const [foto,setFoto]=useState(null);
  /* const [id,setId]=useState(0)
  
  useEffect(() => {
    fetch('https://n89crwvh-4000.brs.devtunnels.ms/foto/download')
    .then(response=> response.json())
    .then(data => setData(data));
  }) */

  return (
    <View style={styles.container}>
      {/* Imagen del perfil */}
      <Image
        
        source={{uri: 'https://n89crwvh-4000.brs.devtunnels.ms/foto/download/archivo-20241012_221457.png'}} // Reemplaza con la ruta de tu imagen
        style={styles.profileImage}
      />

      {/* Información del perfil */}
      <Text style={styles.profileName}>Rosa Andreani</Text>
      <Text style={styles.profileEmail}>rosita@yahoo.com</Text>
    
      

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

