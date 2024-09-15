import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Pressable, Link } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Pressable onPress={()=>navigator.navigate('Usuario')} style={styles.Pressable}><Text>Login</Text></Pressable>
      <Pressable onPress={() =>navigation.navigate('Register')} style={styles.link}>
        <Text style={styles.textLink}>Registrarse</Text>
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
  Pressable:{
    backgroundColor:"#2196F3",
    padding: 10,
    borderRadius:5,
    paddingHorizontal:30,
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
