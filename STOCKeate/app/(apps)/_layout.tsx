import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

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
        name="stock"
        options={{
          title: 'stock',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="main_providers"
        options={{
          title: 'main_providers',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="industry" color={color} />,
        }}
      />
      <Tabs.Screen
        name="styles"
        options={{ href: null}}
      />
      <Tabs.Screen
        name="registrar"
        options={{ href: null, headerShown: false}}
      />
    </Tabs>
  );
}