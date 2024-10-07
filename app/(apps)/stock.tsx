import React from 'react';
import { FlatList, Text, Image, View, Pressable } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';

const componentes = () => {

  const data = [
    { src: require('../../components/producto.png'), key: '1', titulo: 'mate', stock: 10 },//la key seria el codigo de barras
    { src: require('../../components/producto.png'), key: '2', titulo: 'café', stock: 5 },
    { src: require('../../components/producto.png'), key: '3', titulo: 'harina', stock: 8 },
    { src: require('../../components/producto.png'), key: '4', titulo: 'palmito', stock: 2 },
    { src: require('../../components/producto.png'), key: '5', titulo: 'yerba', stock: 20 },
    { src: require('../../components/producto.png'), key: '6', titulo: 'mermelada', stock: 8 },
    { src: require('../../components/producto.png'), key: '7', titulo: 'cacao', stock: 3 },
    { src: require('../../components/producto.png'), key: '8', titulo: 'picadillo', stock: 22 },
    { src: require('../../components/producto.png'), key: '9', titulo: 'pate', stock: 3 },
    { src: require('../../components/producto.png'), key: '10', titulo: 'caballa', stock: 9 },
    { src: require('../../components/producto.png'), key: '11', titulo: 'arroz', stock: 7 },
    { src: require('../../components/producto.png'), key: '12', titulo: 'arvejas', stock: 11 },
    { src: require('../../components/producto.png'), key: '13', titulo: 'sardinas', stock: 15 },
    { src: require('../../components/producto.png'), key: '14', titulo: 'atún', stock: 4 },
    { src: require('../../components/producto.png'), key: '15', titulo: 'choclo', stock: 17 },
    { src: require('../../components/producto.png'), key: '16', titulo: 'lentejas', stock: 19 },
  ];

  return (
    <view>
      <Pressable style={styles.pressableButton} 
        onPress={() => router.push('../main_providers')}
       >
        <Text style={styles.buttonText}>volver</Text>
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
        keyExtractor={(item) => item.key}
        style={styles.flatList}
        />
    </view>
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
