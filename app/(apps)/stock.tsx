import React from 'react';
import { FlatList, Text, Image, View, Pressable } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';

const componentes = () => {

  const data = [
    { src: require('../../components/producto.png'), key: '1', titulo: 'mate', stock: 10 },
    { src: require('../../components/producto.png'), key: '2', titulo: 'cafe', stock: 5 },
    { src: require('../../components/producto.png'), key: '3', titulo: 'harina', stock: 8 },
    { src: require('../../components/producto.png'), key: '4', titulo: 'palmito', stock: 2 },
    { src: require('../../components/producto.png'), key: '5', titulo: 'yerba', stock: 20 },
    { src: require('../../components/producto.png'), key: '6', titulo: 'mermelada', stock: 8 },
    { src: require('../../components/producto.png'), key: '7', titulo: 'cacao', stock: 3 },
    { src: require('../../components/producto.png'), key: '8', titulo: 'picadillo', stock: 22 },
  ];

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({ item }) =>
        <Item
          image={item.src}
          descripcion={item.titulo}
          stock={item.stock}
        />}
      keyExtractor={(item) => item.key}
      style={styles.flatList}
    />
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
