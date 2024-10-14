import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';






export default function PerfilPage() {
  return (
    <View style={styles.container}>
      {/* Imagen del perfil */}
      <Image
        source={require('../../components/perfil.png')} // Reemplaza con la ruta de tu imagen
        style={styles.profileImage}
      />

      {/* Información del perfil */}
      <Text style={styles.profileName}>Rosa Melano</Text>
      <Text style={styles.profileEmail}>rosita@yahoo.com</Text>
    
      

      {/* Botón de cerrar sesión */}
      <Pressable style={styles.pressableButton} onPress={() => console.log('Logout')}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}
