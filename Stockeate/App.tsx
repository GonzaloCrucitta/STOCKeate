import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function App() {
  const [logoColor, setLogoColor] = useState('#000'); 

  return (
    <View style={styles.container}>
      {}
      <View style={styles.logoContainer}>
        <Pressable
          onPress={() => setLogoColor('#F00')} 
          onPressOut={() => setLogoColor('#000')} 
        >
          <Text style={[styles.logoText, { color: logoColor }]}>Stockeaste</Text>
        </Pressable>
      </View>
      

      <View style={styles.buttonContainer}>
        <Pressable onPress={() => navigator.navigate('Usuario')} style={styles.Pressable}>
          <Text>Login</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Register')} style={styles.link}>
          <Text style={styles.textLink}>Registrarse</Text>
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
    position: 'absolute', 
    top: 30,
    width: '100%',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 100, 
    alignItems: 'center',
  },
  Pressable: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 30,
  },
  link: {
    marginTop: 10,
    padding: 10,
  },
  textLink: {
    color: '#2196F3',
    fontSize: 16,
  },
});
