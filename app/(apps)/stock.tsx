import React from 'react';
import { FlatList, Text, Image, View, Pressable } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';

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

  return (
    <View>

      
      <Pressable style={styles.pressableButton} 
        onPress={() => router.push('../articulo')}
        >
        <Text style={styles.buttonText}>Nuevo Articulo</Text>
      </Pressable>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item }) =>
          <Item
            image={item.src}
            descripcion={item.titulo}
            stock={item.stock}
            />}
        //keyExtractor={(item) => item.CodigoBarras}
        style={styles.flatList}
        />
    </View>
  );
}

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

export default componentes;
