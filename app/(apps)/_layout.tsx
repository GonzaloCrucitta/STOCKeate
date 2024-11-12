import React from 'react';
import { Provider, useSelector } from 'react-redux'; // Importar el Provider de Redux
import { Tabs } from 'expo-router'; // Importar el componente Tabs de expo-router
import store, { vaciarCarrito } from './redux/store'; // Importar el store de Redux
import FontAwesome from '@expo/vector-icons/FontAwesome'; 
import { Pressable, Image, Text } from 'react-native';
import { router } from 'expo-router'; // Para la navegación

export default function TabLayout() {
  interface RootState {
    user: {
      email: string;
      name: string;
      id: number;  
      role: string;
    };
  }

  const id= useSelector((state: RootState) => state.user.id);
  const nombre= useSelector((state: RootState) => state.user.name);
  const role= useSelector((state: RootState) => state.user.role);
  function botonVolver(){
    if (role==="Proveedor"){
      router.push("./main_providers")
    }
    else{
      router.push("./cliente")
    }
  }
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
            title: 'Proveedor: '+nombre+', id: '+id,
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
          name="cliente"
          options={{
            title: 'Cliente: '+nombre +', id: '+id,
            tabBarStyle: { display: 'none' },
            tabBarIcon: ({ color }) => <FontAwesome size={28} name='user-circle' color={color} />,
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
              <Pressable onPress={() => botonVolver()} 
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
          options={{
            title: 'Conteo inventario',
            href: null,
            tabBarStyle: { display: 'none' },
            headerRight: () => (
              <Pressable onPress={() => router.push('../main_providers')} 
                style={{ width: 30, height: 30, borderRadius: 15, marginRight: 15 }}>
                <FontAwesome size={28} name="reply" />
              </Pressable>
            ),
            headerLeft: () => (
              <Pressable onPress={() => router.push('../articulo')} 
                style={{ width: 30, height: 30, borderRadius: 15, marginLeft: 15 }}>
                <FontAwesome size={28} name='plus' />
              </Pressable>
            ),
          }}
          
          />
        <Tabs.Screen
          name="articulo"
          options={{
            title: 'articulo',
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
          name="saliente"
          options={{
            title: 'saliente',
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
          name="entrante"
          options={{
            title: 'entrante',
            href: null,
            tabBarStyle: { display: 'none' },
            headerRight: () => (
              <Pressable onPress={() => router.push('../main_providers')} 
                style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}>
                <FontAwesome size={28} name="reply" />
              </Pressable>
            ),
            headerLeft: () => (
              <Pressable onPress={() => vaciarCarrito()} 
                style={{ width: 30, height: 30, borderRadius: 15, marginLeft: 10 }}>
                <FontAwesome size={28} name='repeat' />
              </Pressable>
            ),
          }}
          />
        <Tabs.Screen
          name="estadoPedidoCliente"
          options={{
            title: 'Estado de pedidos',
            href: null,
            tabBarStyle: { display: 'none' },
            headerRight: () => (
              <Pressable onPress={() => router.push('../cliente')} 
                style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}>
                <FontAwesome size={28} name="reply" />
              </Pressable>
            ),
          }}
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
          options={{
            title: 'Articulos a vender',
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
          name="resumenEntrante"
          options={{
            title: 'Articulos a comprar',
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
          name="pedidos_pendientes"
          //options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
          options={{
            title: 'Pedidos Pendientes',
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
          name="movimientos"
          options={{
            title: 'Movimientos',
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
      </Tabs>
    </Provider>
  );
}
