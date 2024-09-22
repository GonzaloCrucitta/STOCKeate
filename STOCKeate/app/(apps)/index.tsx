import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image, TextInput } from 'react-native';
import { Tabs } from 'expo-router';

export default function App() {
  const [showLoginFields, setShowLoginFields] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* <Pressable>
          <Image
            source={require('./logo.png')}
            style={[styles.logoImage]}
          />
        </Pressable> */}
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
          </View>
        )}

        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Registrarse</Text>
        </Pressable>
      </View>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50, 
  },
  logoImage: {
    width: 100, 
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10, 
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
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