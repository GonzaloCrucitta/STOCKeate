import React from 'react';
import { Provider } from 'react-redux'; // Importar el Provider de Redux
import { Tabs } from 'expo-router'; // Importar el componente Tabs de expo-router
import store from './redux/store'; // Importar el store de Redux
import FontAwesome from '@expo/vector-icons/FontAwesome'; 
import { Pressable, Image } from 'react-native';
import { router } from 'expo-router'; // Para la navegación

export default function TabLayout() {
  return (
    <Provider store={store}> {/* Envolvemos las Tabs con el Provider */}
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="main_providers"
          options={{
            title: 'Proveedores',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="industry" color={color} />,
            headerRight: () => (
              <Pressable onPress={() => router.push('../perfil')}>
                <Image
                  source={require('../../components/perfil.png')}
                  style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
                />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            href: null,
            headerRight: () => (
              <Pressable onPress={() => router.push('../main_providers')} 
                style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}>
                <FontAwesome size={28} name="reply" />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="styles"
          options={{ href: null }}
        />
        {/* Otros Tabs como 'registrar', 'stock', etc. */}
        <Tabs.Screen
          name="registrar"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
        />
        {/* Agrega más pantallas aquí si es necesario */}
      </Tabs>
    </Provider>
  );
}
