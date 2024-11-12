import React, { useCallback, useState } from 'react';
import { FlatList, Text, Image, View, Pressable, Alert } from 'react-native';
import styles from './styles';
import { router, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

const Componentes = () => {
  const [articulos, setArticulos] = useState<{ foto: string, id_producto: number, nombre_producto: string, precio: number, cantidad_stock: number, cantidad_compra: number }[]>([]);
  
  const id = useSelector((state: any) => state.user.id);

  useFocusEffect(
    useCallback(() => {
      obtenerProductos(); // Recargar los productos cuando la pantalla reciba el foco
    }, [])
  );

  const obtenerProductos = async () => {
    try {
      const response = await fetch('http://localhost:4000/productos/provedor/' + id);
      if (response.ok) {
        const productos = await response.json();
        const productosConFotos = await Promise.all(
          productos.map(async (producto: any) => {
            const fotoUrl = await obtenerFoto(producto.foto);
            return { ...producto, foto: fotoUrl };
          })
        );
        setArticulos(productosConFotos);
        console.log("Todos los productos obtenidos con fotos: ", productosConFotos);
      } else {
        Alert.alert('Error', 'No se pudieron obtener los productos.');
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      Alert.alert('Error', 'Hubo un problema al conectar con el servidor.');
    }
  };

  const obtenerFoto = async (fotoPath: string) => {
    try {
      const response = await fetch('http://localhost:4000/foto/download/' + fotoPath.split('\\').pop());
      if (response.ok) {
        return response.url; // Devuelve la URL de la imagen directamente
      }
      return require('../../components/producto.png'); // Devuelve una imagen predeterminada si falla
    } catch (error) {
      console.error('Error al obtener la foto:', error);
      return require('../../components/producto.png'); // Imagen predeterminada en caso de error
    }
  };

  const Item = ({ image, descripcion, stock }: { image: any, descripcion: string, stock: number }) => {
    return (
      <Pressable style={styles.linkButton} onPress={() => router.push('../articulo')}>
        <View style={styles.itemContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <Text style={styles.text}>{descripcion}</Text>
          <Text style={styles.stock}>{stock} en stock</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View>
      <Pressable style={styles.pressableButton} onPress={() => router.push('../articulo')}>
        <Text style={styles.buttonText}>Nuevo Articulo</Text>
      </Pressable>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={articulos}
        renderItem={({ item }) => (
          <Item
            image={item.foto}
            descripcion={item.nombre_producto}
            stock={item.cantidad_stock}
          />
        )}
        keyExtractor={(item) => item.id_producto.toString()}
        style={styles.flatList}
      />
    </View>
  );
};

export default Componentes;
