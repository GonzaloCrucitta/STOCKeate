import React, { useCallback, useState } from 'react';
import { FlatList, Text, Image, View, Pressable, Alert } from 'react-native';
import styles from './styles';
import { router, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

const componentes = () => {

  const data = [
    { src: require('../../components/producto.png'), CodigoBarras: '1', titulo: 'mate', stock: 10, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '2', titulo: 'café', stock: 5, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '3', titulo: 'harina', stock: 8, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '4', titulo: 'palmito', stock: 2, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '5', titulo: 'yerba', stock: 20, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '6', titulo: 'mermelada', stock: 8, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '7', titulo: 'cacao', stock: 3, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '8', titulo: 'picadillo', stock: 22, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '9', titulo: 'pate', stock: 3, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '10', titulo: 'caballa', stock: 9, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '11', titulo: 'arroz', stock: 7, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '12', titulo: 'arvejas', stock: 11, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '13', titulo: 'sardinas', stock: 15, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '14', titulo: 'atún', stock: 4, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '15', titulo: 'choclo', stock: 17, precio:0 },
    { src: require('../../components/producto.png'), CodigoBarras: '16', titulo: 'lentejas', stock: 19, precio:0 },
  ];
  const [articulos, setArticulos] = useState<{ foto:String, id_producto: number, nombre_producto: string, precio: number, cantidad_stock: number, cantidad_compra:number }[]>([]);
  
  //http://localhost:4000/foto/download/archivo-20241112_002859.jpg

  useFocusEffect(
    useCallback(() => {
      obtenerProductos(); // Recargar los productos cuando la pantalla reciba el foco
    }, [])
  );
  const obtenerProductos = async () => {
    try {
      const response = await fetch('http://localhost:4000/productos/provedor/'+id);
      if (response.ok) {
        const productosSinfoto = await response.json();
        obtenerfoto(productosSinfoto)
        console.log("Todos los productos obtenidos: ",productosSinfoto);
        
      } else {
        Alert.alert('Error', 'No se pudieron obtener los productos.');
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      Alert.alert('Error', 'Hubo un problema al conectar con el servidor.');
    }
  };
  
  const Item = ({ image, descripcion, stock }: { image: any, descripcion: string, stock: number }) => {
    return (
          <Pressable style={styles.linkButton}
           onPress={() => router.push('../articulo')}>
            <View style={styles.itemContainer}>
              <Image source={image} style={styles.image} />
              <Text style={styles.text}>{descripcion}</Text>
              <Text style={styles.stock}>{stock} en stock</Text>
            </View>
          </Pressable>
    );
  }

  interface RootState {
    user: {
      id: number;
    };
  }
  
  async function obtenerfoto(productosSinfoto: any) {
    console.log("se trata de hacer un fetch a "+productosSinfoto.foto)
    
      const response = await fetch('http://localhost:4000/foto/download/'+productosSinfoto.foto.split('\\').pop())
      if (response.ok) {
        const producto = await response.json();
        console.log("foto : ",producto.foto);
        setArticulos(producto);
      } else {
        Alert.alert('Error', 'No se pudieron obtener la foto.');
      }
  }
  
  const id= useSelector((state: RootState) => state.user.id);


  return (
    <View>

      
      <Pressable style={styles.pressableButton} 
        onPress={() => router.push('../articulo')}
        >
        <Text style={styles.buttonText}>Nuevo Articulo</Text>
      </Pressable>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={articulos}
        renderItem={({ item }) =>
          <Item
            image={item.foto}
            descripcion={item.nombre_producto}
            stock={item.cantidad_stock}
            />}
        //keyExtractor={(item) => item.CodigoBarras}
        style={styles.flatList}
        />
    </View>
  );
}

export default componentes;

