import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles';

const ComprarPage: React.FC = () => {
  const [articulos, setArticulos] = useState<{ id_producto: number, nombre_producto: string, precio: number }[]>([]);
  const [carrito, setCarrito] = useState<{ item: string, cantidad: number, precio: number }[]>([]);
  const router = useRouter();

  // Cargar los productos al montar el componente
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await fetch('http://localhost:4000/productos');
        if (response.ok) {
          const productos = await response.json();
          setArticulos(productos);
        } else {
          Alert.alert('Error', 'No se pudieron obtener los productos.');
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        Alert.alert('Error', 'Hubo un problema al conectar con el servidor.');
      }
    };

    obtenerProductos();
  }, []);

  const handleSeleccionarArticulo = (nombre: string, precio: number) => {
    const productoExistente = carrito.find((producto) => producto.item === nombre);
    if (productoExistente) {
      setCarrito(
        carrito.map((producto) =>
          producto.item === nombre
            ? { ...producto, cantidad: producto.cantidad + 1 }
            : producto
        )
      );
    } else {
      setCarrito([...carrito, { item: nombre, cantidad: 1, precio }]);
    }
  };

  const handleEliminarArticulo = (nombre: string) => {
    const productoExistente = carrito.find((producto) => producto.item === nombre);
    if (productoExistente && productoExistente.cantidad > 1) {
      setCarrito(
        carrito.map((producto) =>
          producto.item === nombre
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        )
      );
    } else {
      setCarrito(carrito.filter((producto) => producto.item !== nombre));
    }
  };

  const handleConfirmarCompra = () => {
    router.push('/confirmarCompra'); 
  };

  const handleVolver = () => {
    router.back(); 
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Seleccione los artículos para comprar:</Text>
      <FlatList
        data={articulos}
        keyExtractor={(item) => item.id_producto.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSeleccionarArticulo(item.nombre_producto, item.precio)}
            style={styles.botonProductoComprarPage}
          >
            <Text>{item.nombre_producto} - ${item.precio.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
      {carrito.length > 0 && (
        <View style={styles.carritoContainerComprarPage}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Artículos en el carrito:</Text>
          <FlatList
            data={carrito}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.carritoItemComprarPage}>
                <Text style={styles.textoCarritoComprarPage}>
                  {item.item} - {item.cantidad} {item.cantidad > 1 ? 'unidades' : 'unidad'} - ${item.precio.toFixed(2)} c/u
                </Text>
                <TouchableOpacity
                  onPress={() => handleEliminarArticulo(item.item)}
                  style={styles.botonEliminarComprarPage}
                >
                  <Text style={styles.textoBotonEliminarComprarPage}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Confirmar Compra" onPress={handleConfirmarCompra} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Volver al Inicio" onPress={handleVolver} />
      </View>
    </ScrollView>
  );
};

export default ComprarPage;
