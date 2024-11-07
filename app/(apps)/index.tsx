  import React, { useState } from 'react';
  import { Text, View, Pressable, Image, TextInput, Alert } from 'react-native';
  import { useRouter } from 'expo-router';
  import styles from './styles';

  export default function App() {
    const [showLoginFields, setShowLoginFields] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); 

    // Function to check if email exists and verify password
    const handleLogin = async () => {
      try {
        const response = await fetch(`http://localhost:4000/provedores/email/${email}`);
        if (response.status === 404) {
          Alert.alert('Email no encontrado', 'El email ingresado no está registrado.');
        } else if (response.ok) {
          const proveedor = await response.json();

          // Check if the entered password matches the retrieved password
          if (proveedor.contrasenia === password) {
            // Password is correct, navigate to main_providers
            console.log("aca le envio el mail",email)
            router.push(`/main_providers?email=${encodeURIComponent(proveedor.email)}`);

          } else {
            Alert.alert('Contraseña incorrecta', 'La contraseña ingresada es incorrecta.');
          }
        } else {
          Alert.alert('Error', 'Hubo un problema al verificar el email.');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo conectar al servidor.');
        console.error('Error al verificar el email:', error);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Pressable>
            <Image
              source={require('../../components/logo.png')}
              style={[styles.logoImage]}
            />
          </Pressable>
          <Text style={[styles.logoText]}>Stockeate</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.pressableButton}
            onPress={() => setShowLoginFields(!showLoginFields)} 
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          {showLoginFields && (
            <View style={styles.loginFields}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable 
                style={styles.pressableButton}
                onPress={handleLogin} // Trigger login check when button is pressed
              >
                <Text style={styles.buttonText}>Ingresar</Text>
              </Pressable>
            </View>
          )}

          <Pressable style={styles.linkButton}
            onPress={() => router.push('../registrar')}>
            <Text style={styles.linkText}>Registrarse</Text>
          </Pressable>
        </View>
      </View>
    );
  }
