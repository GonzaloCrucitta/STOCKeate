import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import styles from './styles';
import { useTheme } from '@react-navigation/native';


export default function TabLayout() {
  return (
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
          //title: 'main_providers',
          //tabBarIcon: ({ color }) => <FontAwesome size={28} name="industry" color={color} />,
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
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='id-card' color={color} />,
                  
        }}
      />
      <Tabs.Screen
        name="styles"
        options={{ href: null}}
      />
      <Tabs.Screen
        name="registrar"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
      />
      <Tabs.Screen
        name="stock"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
      />
      <Tabs.Screen
        name="entrante"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
      />
      <Tabs.Screen
        name="saliente"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
      />
      {<Tabs.Screen
        name="articulo"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
      />}
      {<Tabs.Screen
        name="pedidos_pendientes"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
      />}
      {<Tabs.Screen
        name="resumenSaliente"
        options={{ href: null, headerShown: false, tabBarStyle: { display: 'none' }}}
      />}
    </Tabs>
  );
}