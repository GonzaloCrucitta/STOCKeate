import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import styles from './styles';
import { useTheme } from '@react-navigation/native';

const nuevoEntrante = () => {
    const data = [
        { src: require('../../components/producto.png'), CodigoBarras: '1', titulo: 'mate', stock: 10 },//la key seria el codigo de barras
        { src: require('../../components/producto.png'), CodigoBarras: '2', titulo: 'café', stock: 5 },
        { src: require('../../components/producto.png'), CodigoBarras: '3', titulo: 'harina', stock: 8 },
        ];

    return(
        <View>
        
      <Pressable style={styles.pressableButton} 
        onPress={() => router.push('../main_providers')}
        >
        <Text style={styles.buttonText}>volver</Text>
      </Pressable>
      <Pressable style={styles.pressableButton} 
        onPress={() => router.push('../articulo')}
        >
        <Text style={styles.buttonText}>Nuevo Entrante</Text>
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
        keyExtractor={(item) => item.CodigoBarras}
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

export default nuevoEntrante;