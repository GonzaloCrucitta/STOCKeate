import React, { useCallback, useState } from 'react';
import { FlatList, Text, Image, View, Pressable, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import styles from './styles';
import { router, useFocusEffect } from 'expo-router';
import { useSelector } from 'react-redux';

const Componentes = () => {
  const [articulos, setArticulos] = useState<{ foto: string, id_producto: number, nombre_producto: string, precio: number, cantidad_stock: number, cantidad_compra: number }[]>([]);
  const [loading, setLoading] = useState(false); // Estado para controlar el refresco
  const [refreshing, setRefreshing] = useState(false); // Estado para el pull to refresh
  const id = useSelector((state: any) => state.user.id);

  useFocusEffect(
    useCallback(() => {
      obtenerProductos(); // Recargar los productos cuando la pantalla reciba el foco
    }, [])
  );

  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+'/productos/provedor/' + id);
      if (response.ok) {
        const productos = await response.json();
        const productosConFotos = await Promise.all(
          productos.map(async (producto: any) => {
            const fotoUrl = await obtenerFoto(producto.foto);
            return { ...producto, foto: fotoUrl };
          })
        );
        setArticulos(productosConFotos);
        //console.log("Todos los productos obtenidos con fotos: ", productosConFotos);
      } else {
        Alert.alert('Error', 'No se pudieron obtener los productos.');
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      Alert.alert('Error', 'Hubo un problema al conectar con el servidor.');
    }
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const onRefresh = useCallback(() => {
      setRefreshing(true);
      obtenerProductos();
    }, []);
  const obtenerFoto = async (fotoPath: string) => {
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+'/foto/download/' + fotoPath.split('\\').pop());
      if (response.ok) {
        return response.url; // Devuelve la URL de la imagen directamente
      }
      return require('../../components/producto.png'); // Devuelve una imagen predeterminada si falla
    } catch (error) {
      console.error('Error al obtener la foto:', error);
      return require('../../components/producto.png'); // Imagen predeterminada en caso de error
    }
  };

  const Item = ({ image, nombre, stock, id_Articulo}: { image: any, nombre: string, stock: number, id_Articulo: number }) => {
    return (
      <Pressable style={styles.linkButton} onPress={() => router.push({ pathname: '/editarArticulo', params: { id_Articulo } })}>
        <View style={styles.itemContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <Text style={styles.text}>{nombre}</Text>
          <Text style={styles.stock}>{stock} en stock</Text>
        </View>
      </Pressable>
    );
  };

  return (
  <View style={{ flex: 1, backgroundColor: '#f6f8fa', paddingTop: 24 }}>
    {loading && articulos.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
      ) : (
    <FlatList
      showsHorizontalScrollIndicator={false}
      data={articulos}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.linkButton,
            pressed && { opacity: 0.85, backgroundColor: '#e0e7ef' }
          ]}
          android_ripple={{ color: '#e0e7ef' }}
          onPress={() => router.push({ pathname: '/editarArticulo', params: { id_Articulo: item.id_producto } })}
        >
          <View style={styles.itemContainer}>
            <Image source={typeof item.foto === 'string' ? { uri: item.foto } : item.foto} style={styles.image} />
            <Text style={styles.text}>{item.nombre_producto}</Text>
            <Text style={styles.stock}>{item.cantidad_stock} en stock</Text>
          </View>
        </Pressable>
      )}
      keyExtractor={(item) => item.id_producto.toString()}
      style={styles.flatList}
      contentContainerStyle={{ paddingBottom: 40 }}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', color: '#64748b', marginTop: 40 }}>
          No hay productos para mostrar.
        </Text>
      }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0000ff']} // Color del indicador (opcional)
              tintColor="#0000ff" // Color del indicador para iOS (opcional)
            />
          }
        />
      )}
    </View>
  );
};

export default Componentes;
