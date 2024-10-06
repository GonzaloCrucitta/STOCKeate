import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image, TextInput } from 'react-native';
import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import styles from './styles';

export default function App() {
  const [showLoginFields, setShowLoginFields] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        { <Pressable>
          <Image
            source={require('../../components/logo.png')}
            style={[styles.logoImage]}
          />
        </Pressable> }
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

        <Pressable style={styles.linkButton}
         onPress={() => router.push('../registrar')}>
          <Text style={styles.linkText}>Registrarse</Text>
        </Pressable>
      </View>
    </View>
  );
}

