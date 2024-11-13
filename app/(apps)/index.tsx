import React, { useState } from 'react';
import { Text, View, Pressable, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import store, { setId, setName, setEmail, setRole, setUriFoto } from './redux/store';
import styles from './styles';

function AppComponent() {
  const [showLoginFields, setShowLoginFields] = useState(false);
  const [email, setEmailLocal] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      // Intentar verificar el usuario como "Proveedor"
      let response = await fetch(`http://localhost:4000/provedores/email/${email}`);
      if (response.status === 200) {
        const proveedor = await response.json();
        if (proveedor.contrasenia === password) {
          dispatch(setEmail(proveedor.email));
          dispatch(setUriFoto(proveedor.foto));
          dispatch(setName(proveedor.nombre));
          dispatch(setId(proveedor.id_proveedor));
          dispatch(setRole("Proveedor"));
          console.log("Proveedor - nombre: ", proveedor.nombre, " email: ", proveedor.email, " id: ", proveedor.id_proveedor,"uri:",proveedor.foto);

          // Redirigir a la pantalla principal de proveedores
          router.push(`/main_providers`);
          return;
        } else {
          Alert.alert('Contraseña incorrecta', 'La contraseña ingresada es incorrecta.');
          return;
        }
      }

      // Si no es un proveedor, intentar verificar como "Cliente"
      response = await fetch(`http://localhost:4000/cliente/buscar/email/${email}`);
      if (response.status === 200) {
        const cliente = await response.json();
        if (cliente.contrasena === password) {
          dispatch(setEmail(cliente.email));
          dispatch(setUriFoto(cliente.foto));
          dispatch(setName(cliente.nombre));
          dispatch(setId(cliente.id_cliente));
          dispatch(setRole("Cliente"));
          console.log("Cliente - nombre: ", cliente.nombre, " email: ", cliente.email, " id: ", cliente.id_cliente,"uri:",cliente.foto);

          // Redirigir a la pantalla principal de clientes
          router.push(`/cliente`);
          return;
        } else {
          Alert.alert('Contraseña incorrecta', 'La contraseña ingresada es incorrecta.');
          return;
        }
      }

      // Si no se encontró como proveedor ni cliente, mostrar alerta
      Alert.alert('Email no encontrado', 'El email ingresado no está registrado.');
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
            style={styles.logoImage}
          />
        </Pressable>
        <Text style={styles.logoText}>Stockeate</Text>
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
              onChangeText={setEmailLocal}
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
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Ingresar</Text>
            </Pressable>
          </View>
        )}

        <Pressable style={styles.linkButton} onPress={() => router.push('../registrar')}>
          <Text style={styles.linkText}>Registrarse</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppComponent />
    </Provider>
  );
}
