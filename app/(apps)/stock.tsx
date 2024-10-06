import React, { useState } from 'react';
import {FlatList,StyleSheet,Text,Image, Pressable, View} from 'react-native';
import styles from './styles';
const componentes = () =>{
  const data = [
  {src:require('../../components/producto.png'),key:'1', titulo: 'articulo 1'},
  {src:require('../../components/producto.png'),key:'2', titulo: 'articulo 2'},
  {src:require('../../components/producto.png'),key:'3', titulo: 'articulo 3'},
  {src:require('../../components/producto.png'),key:'4', titulo: 'articulo 4'},
  {src:require('../../components/producto.png'),key:'5', titulo: 'articulo 5'}
  ];
  return (
    <FlatList 
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({ item }) => 
        <Item 
          image={item.src}
          descripcion={item.titulo}
          />}
      keyExtractor={(item) => item.key}
      style={styles.flatList}
    />
  )
}
const Item = ( {image, descripcion}:{image:any, descripcion:string})=> {
  return (
    <View style={styles.container} >
      <Image source={image} style={styles.image}/>
      <Text style={styles.text}> {descripcion}</Text>
    </View>)
}

export default componentes;
