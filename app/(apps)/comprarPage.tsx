import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; 
import styles from './styles';

const ComprarPage: React.FC = () => {
  const [articulos, setArticulos] = useState<{ item: string }[]>([
    { item: 'Producto 1' },
    { item: 'Producto 2' },
    { item: 'Producto 3' },
  ]);

  const [carrito, setCarrito] = useState<{ item: string, cantidad: number }[]>([]); 
  const router = useRouter(); 

  const handleSeleccionarArticulo = (item: string) => {
    const productoExistente = carrito.find((producto) => producto.item === item);
    if (productoExistente) {
      setCarrito(
        carrito.map((producto) =>
          producto.item === item
            ? { ...producto, cantidad: producto.cantidad + 1 }
            : producto
        )
      );
    } else {
      setCarrito([...carrito, { item, cantidad: 1 }]);
    }
    console.log(`Artículo seleccionado: ${item}`);
  };

  const handleEliminarArticulo = (item: string) => {
    const productoExistente = carrito.find((producto) => producto.item === item);
    if (productoExistente && productoExistente.cantidad > 1) {
      setCarrito(
        carrito.map((producto) =>
          producto.item === item
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        )
      );
    } else {
      setCarrito(carrito.filter((producto) => producto.item !== item));
    }
    console.log(`Artículo eliminado: ${item}`);
  };

  const handleVolver = () => {
    router.back(); 
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Seleccione los artículos para comprar:</Text>
      <FlatList
        data={articulos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSeleccionarArticulo(item.item)}
            style={styles.botonProductoComprarPage} 
          >
            <Text>{item.item}</Text>
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
                  {item.item} - {item.cantidad} {item.cantidad > 1 ? 'unidades' : 'unidad'}
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
        <Button title="Volver a la compra" onPress={handleVolver} />
      </View>
    </ScrollView>
  );
};

export default ComprarPage;

