import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, FlatList, TouchableOpacity, Button, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { agregarProducto, eliminarProducto } from './redux/store'; // Ruta del archivo store
import styles from './styles';

const ComprarPage: React.FC = () => {
  const [articulos, setArticulos] = useState<{ id_producto: number, nombre_producto: string, precio: number ,foto: string }[]>([]);
  const carrito = useSelector((state: any) => state.carrito.items);
  const dispatch = useDispatch();
  const router = useRouter();

  // Cargar los productos al montar el componente y actualizar cada minuto
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

    obtenerProductos(); // Llamar la función inicialmente

    // Configurar actualización cada minuto (60,000 ms)
    const intervalId = setInterval(obtenerProductos, 60000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
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

  const handleVolver = () => {
    router.push('/cliente');
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Seleccione los artículos para comprar:</Text>
      <FlatList
        data={articulos}
        keyExtractor={(item) => item.id_producto.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSeleccionarArticulo(item.id_producto, item.nombre_producto, item.precio)}
            style={styles.botonProductoComprarPage}
          >
            <Text>{item.nombre_producto} - ${item.precio.toFixed(2)}</Text><Image source={{uri:'http://localhost:4000/foto/download/'+item.foto}}
            style={{ width: 80, height: 80, marginTop: 5 }}/>
          </TouchableOpacity>
        )}
      />
      {carrito.length > 0 && (
        <View style={styles.carritoContainerComprarPage}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Artículos en el carrito:</Text>
          <FlatList
            data={carrito}
            keyExtractor={(item) => item.id_producto.toString()}
            renderItem={({ item }) => (
              <View style={styles.carritoItemComprarPage}>
                <Text style={styles.textoCarritoComprarPage}>
                  {item.nombre} - {item.cantidad} {item.cantidad > 1 ? 'unidades' : 'unidad'} - ${item.precio.toFixed(2)} c/u
                </Text>
                <TouchableOpacity
                  onPress={() => handleEliminarArticulo(item.id_producto)}
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

      
    </ScrollView>
  );
};

export default ComprarPage;
