import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.loginFields}>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombres"
          value={name}
          onChangeText={setName}
        />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.pressableButton}>
            <Text style={styles.buttonText}>REGISTRARSE</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.linkButton}>
        <Text style={styles.linkText}>Iniciar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  pressableButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    paddingHorizontal: 40,
    marginBottom: 10, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: '#2196F3',
    fontSize: 16,
  },
  loginFields: {
    width: '80%',
    marginVertical: 10, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10, 
    width: '100%',
  },
});
