import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; // Usamos router para la navegación
import styles from './styles';

const ComprarPage: React.FC = () => {
  const [articulos, setArticulos] = useState<{ item: string }[]>([
    { item: 'Producto 1' },
    { item: 'Producto 2' },
    { item: 'Producto 3' },
  ]);

  const [carrito, setCarrito] = useState<{ item: string, cantidad: number }[]>([]); // Estado para los artículos en el carrito
  const router = useRouter(); // Usamos router para la navegación

  const handleSeleccionarArticulo = (item: string) => {
    const productoExistente = carrito.find((producto) => producto.item === item);
    if (productoExistente) {
      // Si el producto ya está en el carrito, incrementamos la cantidad
      setCarrito(
        carrito.map((producto) =>
          producto.item === item
            ? { ...producto, cantidad: producto.cantidad + 1 }
            : producto
        )
      );
    } else {
      // Si no está en el carrito, lo agregamos con cantidad 1
      setCarrito([...carrito, { item, cantidad: 1 }]);
    }
    console.log(`Artículo seleccionado: ${item}`);
  };

  const handleEliminarArticulo = (item: string) => {
    const productoExistente = carrito.find((producto) => producto.item === item);
    if (productoExistente && productoExistente.cantidad > 1) {
      // Si el producto tiene más de una unidad, solo reducimos la cantidad
      setCarrito(
        carrito.map((producto) =>
          producto.item === item
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        )
      );
    } else {
      // Si el producto tiene solo una unidad, lo eliminamos
      setCarrito(carrito.filter((producto) => producto.item !== item));
    }
    console.log(`Artículo eliminado: ${item}`);
  };

  const handleVolver = () => {
    router.back(); // Volver a la página anterior
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {/* Sección de productos */}
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Seleccione los artículos para comprar:</Text>
      <FlatList
        data={articulos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSeleccionarArticulo(item.item)}
            style={styles.botonProductoComprarPage} // Estilo de los botones para agregar productos
          >
            <Text>{item.item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Carrito de compras */}
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
                </Text> {/* Estilo para los artículos en el carrito */}
                <TouchableOpacity
                  onPress={() => handleEliminarArticulo(item.item)}
                  style={styles.botonEliminarComprarPage} // Estilo del botón de eliminar
                >
                  <Text style={styles.textoBotonEliminarComprarPage}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Botón de Volver al final */}
      <View style={{ marginTop: 20 }}>
        <Button title="Volver a la compra" onPress={handleVolver} />
      </View>
    </ScrollView>
  );
};

export default ComprarPage;

