import { Stack } from 'expo-router/stack';
import { Provider } from 'react-redux';
import store from './(apps)/redux/store'; // Importar el store de Redux

export default function Layout() {
  return (
    <Provider store={store}>
       <Stack>
        <Stack.Screen name="(apps)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}