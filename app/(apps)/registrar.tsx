import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Vibration, Alert } from 'react-native';
import styles from './styles';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState(''); 
  const [dniNumber, setDniNumber] = useState(''); 
  const [telefono, setTelefono] = useState(''); 
  const [direccion, setDireccion] = useState('');
  const [role, setRole] = useState(null); 
  const [showLoginFields, setShowLoginFields] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [showRegister, setShowRegister] = useState(true);
  const [errors, setErrors] = useState({}); 

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const validateFields = () => {
    let valid = true;
    let newErrors = {};

    if (!username) {
      newErrors.username = 'El nombre de usuario es obligatorio';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
      valid = false;
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
      valid = false;
    }

    if (!email) {
      newErrors.email = 'El email es obligatorio';
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'El formato del email no es válido';
      valid = false;
    }

    if (!name) {
      newErrors.name = 'El nombre es obligatorio';
      valid = false;
    }

    if (role === 'Proveedor') {
      if (!company) {
        newErrors.company = 'El nombre de la compañía es obligatorio';
        valid = false;
      }
      if (!dniNumber) {
        newErrors.dniNumber = 'El DNI es obligatorio';
        valid = false;
      }
      if (!telefono) {
        newErrors.telefono = 'El teléfono es obligatorio';
        valid = false;
      }
      if (!direccion) {
        newErrors.direccion = 'La dirección es obligatoria';
        valid = false;
      }
    }

    setErrors(newErrors);
    if (!valid) {
      Vibration.vibrate();
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios correctamente');
    }
    return valid;
  };

  const handleRegister = () => {
    if (validateFields()) {
      setShowRegister(false);
    }
  };

  const newProveedor = {
    nombre: name, 
    email: email, 
    telefono: telefono, 
    direccion: direccion, 
    contrasenia: password,
    nombre_empresa: company, 
    dni: dniNumber,
    foto: 'articulo_por_defecto.png'
  };
  
  const newCliente = {
    usuario: name,
    contrasena: password,
    email: email,
    nombre: name,
    foto:'articulo_por_defecto.png',  
  };

  async function crearProveedor(proveedor) {
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+"/provedores", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proveedor),
      });
     
      if (!response.ok) {
        throw new Error('Error al crear el proveedor');
      }
      
      const newProveedor = await response.json();
      console.log('Proveedor creado', newProveedor);
      router.push('/');

    } catch (error) {
      console.error('Error al crear el proveedor:', error);
    }
  }

  async function crearCliente(cliente) {
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+"/cliente/agregar", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        throw new Error('Error al crear el cliente');
      }

      const newCliente = await response.json();
      console.log('Cliente creado', newCliente);
      router.push('/');
    } catch (error) {
      console.error('Error al crear el cliente:', error);
    }
  }

  return (
    <View style={styles.container}>
      {!showRoleSelection && (
        <View style={styles.loginFields}>
          <TextInput
            style={[styles.input, errors.username ? { borderColor: 'red' } : null]}
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          
          <TextInput
            style={[styles.input, errors.password ? { borderColor: 'red' } : null]}
            placeholder="Contraseña"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            style={[styles.input, errors.email ? { borderColor: 'red' } : null]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, errors.name ? { borderColor: 'red' } : null]}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          {role === 'Proveedor' && (
            <>
              <TextInput
                style={[styles.input, errors.company ? { borderColor: 'red' } : null]}
                placeholder="Nombre de la Compañía"
                value={company}
                onChangeText={setCompany}
              />
              {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}
              
              <TextInput
                style={[styles.input, errors.dniNumber ? { borderColor: 'red' } : null]}
                placeholder="DNI"
                value={dniNumber}
                onChangeText={setDniNumber}
              />
              {errors.dniNumber && <Text style={styles.errorText}>{errors.dniNumber}</Text>}

              <TextInput
                style={[styles.input, errors.telefono ? { borderColor: 'red' } : null]}
                placeholder="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
              />
              {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}

              <TextInput
                style={[styles.input, errors.direccion ? { borderColor: 'red' } : null]}
                placeholder="Dirección"
                value={direccion}
                onChangeText={setDireccion}
              />
              {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}
            </>
          )}
          
          {showRegister && (
            <View style={styles.buttonContainer}>
              <Pressable style={styles.pressableButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>REGISTRARSE</Text>
              </Pressable>
            </View>
          )}

          {!showRegister && (
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.pressableButton}
                onPress={() => {
                  if (role === 'Proveedor') {
                    crearProveedor(newProveedor);
                  } else if (role === 'Cliente') {
                    crearCliente(newCliente);
                  }
                }}
              >
                <Text style={styles.buttonText}>CONTINUAR</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.pressableButton}
              onPress={() => {
                setShowLoginFields(false);
                setShowRoleSelection(true);
                setShowRegister(true);
                setUsername('');
                setPassword('');
                setEmail('');
                setName('');
                setCompany('');
                setDniNumber('');
                setTelefono('');
                setDireccion('');
                setRole(null);
                setErrors({});
              }}
            >
              <Text style={styles.buttonText}>Atrás</Text>
            </Pressable>
          </View>
        </View>
      )}

      {showRoleSelection && (
        <View style={styles.roleSelectionContainer}>
          <Text style={styles.roleText}>Elige tu rol</Text>
          <Pressable
            style={styles.pressableButton}
            onPress={() => {
              setRole('Cliente');
              setShowLoginFields(true);
              setShowRoleSelection(false);
            }}
          >
            <Text style={styles.buttonText}>Cliente</Text>
          </Pressable>
          <Pressable
            style={styles.pressableButton}
            onPress={() => {
              setRole('Proveedor');
              setShowLoginFields(true);
              setShowRoleSelection(false);
            }}
          >
            <Text style={styles.buttonText}>Proveedor</Text>
          </Pressable>
        </View>
      )}

      <Pressable style={styles.linkButton} onPress={() => router.push('../')}>
        <Text style={styles.linkText}>Iniciar sesión</Text>
      </Pressable>
    </View>
  );
}
