import React from 'react';
import { Provider } from 'react-redux'; // Importar el Provider de Redux
import { Tabs } from 'expo-router'; // Importar el componente Tabs de expo-router
import store from './redux/store'; // Importar el store de Redux
import FontAwesome from '@expo/vector-icons/FontAwesome'; 
import { Pressable, Image, Text } from 'react-native';
import { router } from 'expo-router'; // Para la navegación

export default function TabLayout() {
  return (
    <Provider store={store}>

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
            tabBarStyle: { display: 'none' },
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
            tabBarStyle: { display: 'none' },
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
        <Tabs.Screen
          name="stock"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
          />
        <Tabs.Screen
          name="articulo"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
          />
        <Tabs.Screen
          name="saliente"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
          />
        <Tabs.Screen
          name="entrante"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
          />
        <Tabs.Screen
          name="formularioPago"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
        />
        <Tabs.Screen
          name="confirmarCompra"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
          />
        <Tabs.Screen
          name="resumenSaliente"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
          />
        <Tabs.Screen
          name="pedidos_pendientes"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
        />
        <Tabs.Screen
          name="redux/store"
          options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
          />
        <Tabs.Screen
          name="comprarPage"
          options={{
            href: null,
            title: 'Comprar',
            headerShown: false, 
            tabBarStyle: { display: 'none' },
            
          }}
        />
        <Tabs.Screen
          //????
          name="logout"
          options={{
            title: 'Cerrar Sesión',
            tabBarStyle: { display: 'none' }, 
            headerShown: false, 
            
            tabBarButton: () => (
              <Pressable onPress={() => {
                // Aquí iría la lógica para cerrar sesión, por ejemplo limpiar el estado de Redux o eliminar un token
                router.push('/'); // Redirigir al usuario a la página de inicio
              }}>
                <Text>Cerrar sesión</Text> 
              </Pressable>
            ),
          }}
          />
      </Tabs>
    </Provider>
  );
}
