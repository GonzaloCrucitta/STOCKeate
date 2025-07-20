import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert, Image, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { agregarProducto, eliminarProducto } from './redux/store';
import styles from './styles';

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  foto: string;
}

interface CarritoItem {
  id_producto: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const ComprarPage: React.FC = () => {
  const [articulos, setArticulos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const carrito = useSelector((state: any) => state.carrito.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+'/productos');
      if (response.ok) {
        const productos = await response.json();
        setArticulos(productos);
      } else {
        Alert.alert('Error', 'No se pudieron obtener los productos.');
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      Alert.alert('Error', 'Hubo un problema al conectar con el servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
    const intervalId = setInterval(obtenerProductos, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    obtenerProductos();
  }, []);

  const handleSeleccionarArticulo = (id_producto: number, nombre: string, precio: number) => {
    dispatch(agregarProducto({ id_producto, nombre, precio }));
  };

  const handleEliminarArticulo = (id_producto: number) => {
    dispatch(eliminarProducto(id_producto));
  };

  const handleConfirmarCompra = () => {
    router.push('/confirmarCompra');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f8fa' }}>
      {loading && articulos.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 1 }}>
          {carrito.length > 0 && (
            <View style={styles.carritoContainer}>
              <Text style={styles.carritoTitle}>Artículos en el carrito:</Text>
              <ScrollView 
                style={styles.carritoList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {carrito.map((item: CarritoItem) => (
                  <View key={item.id_producto.toString()} style={styles.carritoItem}>
                    <Text style={styles.carritoItemText} numberOfLines={1}>
                      {item.nombre} ({item.cantidad})
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleEliminarArticulo(item.id_producto)}
                      style={styles.carritoDeleteButton}
                    >
                      <Text style={styles.carritoDeleteText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmarCompra}
              >
                <Text style={styles.confirmButtonText}>Confirmar Compra</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={articulos}
            keyExtractor={(item) => item.id_producto.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.linkButton}
                activeOpacity={0.85}
                onPress={() => handleSeleccionarArticulo(item.id_producto, item.nombre_producto, item.precio)}
              >
                <View style={styles.itemContainer}>
                  <Image 
                    source={{ uri: process.env.EXPO_PUBLIC_URL_SERVIDOR+'/foto/download/'+item.foto }}
                    style={styles.image}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.text}>{item.nombre_producto}</Text>
                    <Text style={styles.stock}>${item.precio.toFixed(2)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#0000ff']}
                tintColor="#0000ff"
              />
            }
            contentContainerStyle={{ 
              paddingBottom: 20,
              paddingTop: carrito.length > 0 ? 0 : 20
            }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#64748b', marginTop: 40 }}>
                No hay productos disponibles.
              </Text>
            }
            style={{ 
              flex: 1,
              marginTop: carrito.length > 0 ? 0 : 20
            }}
          />
        </View>
      )}
    </View>
  );
};

export default ComprarPage;