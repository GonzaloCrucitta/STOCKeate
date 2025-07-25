import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import store, { setId, setName, setEmail, setRole, setUriFoto, setContrasenia } from './redux/store';
import styles from './styles';

function AppComponent() {
  const [showLoginFields, setShowLoginFields] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmailLocal] = useState('');
  const [password, setPassword] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter(); 
  const dispatch = useDispatch();

  // Restaurar sesión al iniciar la app o al volver a esta pantalla
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const checkSession = async () => {
        setIsCheckingSession(true);
        const session = await AsyncStorage.getItem('session');
        if (session && isActive) {
          const data = JSON.parse(session);
          dispatch(setEmail(data.email));
          dispatch(setUriFoto(data.urifoto));
          dispatch(setName(data.name));
          dispatch(setId(data.id));
          dispatch(setRole(data.role));
          dispatch(setContrasenia(data.contrasenia));
          if (data.role === "Proveedor") {
            router.replace('/main_providers');
          } else if (data.role === "Cliente") {
            router.replace('/cliente');
          }
        } else if (isActive) {
          setIsCheckingSession(false);
          setShowLoginFields(false);
          setSelectedRole(null);
          setEmailLocal('');
          setPassword('');
        }
      };
      checkSession();
      return () => { isActive = false; };
    }, [])
  );

  const handleLogin = async () => {
    try {
      if (selectedRole === "Proveedor") {
        // Login como Proveedor
        let response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+`/provedores/email/${email}`);
        if (response.status === 200) {
          const proveedor = await response.json();
          if (proveedor.contrasenia === password) {
            dispatch(setEmail(proveedor.email));
            dispatch(setUriFoto(proveedor.foto));
            dispatch(setName(proveedor.nombre));
            dispatch(setId(proveedor.id_proveedor));
            dispatch(setRole("Proveedor"));
            dispatch(setContrasenia(proveedor.contrasenia));
            // Guardar sesión
            await AsyncStorage.setItem('session', JSON.stringify({
              role: "Proveedor",
              email: proveedor.email,
              name: proveedor.nombre,
              id: proveedor.id_proveedor,
              urifoto: proveedor.foto,
              contrasenia: proveedor.contrasenia,
            }));
            router.replace(`/main_providers`);
            return;
          } else {
            Alert.alert('Contraseña incorrecta', 'La contraseña ingresada es incorrecta.');
            return;
          }
        }
        Alert.alert('Email no encontrado', 'El email ingresado no está registrado como proveedor.');
      } else if (selectedRole === "Cliente") {
        // Login como Cliente
        let response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+`/cliente/buscar/email/${email}`);
        if (response.status === 200) {
          const cliente = await response.json();
          if (cliente.contrasena === password) {
            dispatch(setEmail(cliente.email));
            dispatch(setUriFoto(cliente.foto));
            dispatch(setName(cliente.nombre));
            dispatch(setId(cliente.id_cliente));
            dispatch(setRole("Cliente"));
            dispatch(setContrasenia(cliente.contrasena));
            // Guardar sesión
            await AsyncStorage.setItem('session', JSON.stringify({
              role: "Cliente",
              email: cliente.email,
              name: cliente.nombre,
              id: cliente.id_cliente,
              urifoto: cliente.foto,
              contrasenia: cliente.contrasena,
            }));
            router.replace(`/cliente`);
            return;
          } else {
            Alert.alert('Contraseña incorrecta', 'La contraseña ingresada es incorrecta.');
            return;
          }
        }
        Alert.alert('Email no encontrado', 'El email ingresado no está registrado como cliente.');
      } else {
        Alert.alert('Selecciona un rol', 'Por favor, selecciona si eres Cliente o Proveedor.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor.');
      console.error('Error al verificar el email:', error);
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setShowLoginFields(true);
    setEmailLocal('');
    setPassword('');
  };

  const handleBack = () => {
    setShowLoginFields(false);
    setSelectedRole(null);
    setEmailLocal('');
    setPassword('');
    // El useEffect se encargará de redirigir si hay sesión
  };

  if (isCheckingSession) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

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
        {!showLoginFields ? (
          <>
            <Text style={styles.roleText}>¿Cómo quieres ingresar?</Text>
            <Pressable
              style={styles.pressableButton}
              onPress={() => handleRoleSelect("Cliente")}
            >
              <Text style={styles.buttonText}>Cliente</Text>
            </Pressable>
            <Pressable
              style={styles.pressableButton}
              onPress={() => handleRoleSelect("Proveedor")}
            >
              <Text style={styles.buttonText}>Proveedor</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.loginFields}>
            <Text style={styles.roleText}>Login como {selectedRole}</Text>
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
            {/* Agrupamos los botones "Atrás" y "Registrarse" en una fila centrada */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <Pressable
                style={[styles.linkButton, { marginRight: 20 }]}
                onPress={handleBack}
              >
                <Text style={styles.linkText}>Atrás</Text>
              </Pressable>
              <Pressable
                style={styles.linkButton}
                onPress={() => router.push('../registrar')}
              >
                <Text style={styles.linkText}>Registrarse</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Solo mostramos "Registrarse" abajo si no está en login */}
        {!showLoginFields && (
          <Pressable style={styles.linkButton} onPress={() => router.push('../registrar')}>
            <Text style={styles.linkText}>Registrarse</Text>
          </Pressable>
        )}
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
