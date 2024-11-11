import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Pressable, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';

const Saliente = () => {
  const [articulos, setArticulos] = useState<{ id_producto: number, nombre_producto: string, precio: number, cantidad_stock: number, cantidad_vender:0 }[]>([]);
  function productosSeleccionados(){
    return articulos.filter((item)=>{item.cantidad_vender>0?item:null})
  }
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await fetch('http://localhost:4000/productos/provedor/'+id);
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

    obtenerProductos();
  }, []);
  interface RootState {
    user: {
      email: string;
      name: string;
      id: number;  // Aquí debes usar 'number' en lugar de 'int' en TypeScript
      role: string;
    };
  }

  const id= useSelector((state: RootState) => state.user.id);


  //const productosSeleccionados = data.filter(item => item.cantidadVender > 0);



  return (
    <View style={styles.container}>

      {/* Listado de productos */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={articulos}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.text}>{item.nombre_producto}</Text>
            <Text style={styles.stock}>{item.cantidad_stock} en stock</Text>
            
            {/* Entrada para la cantidad a vender */}
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Cantidad a vender"
              value={item.cantidad_vender ? item.cantidad_vender : '0'}
              
            />
          </View>
        )}
        keyExtractor={(item) => item.id_producto.toString()}
        style={styles.flatList}
      />

      {/* Botón para ir a la página de resumen */}
      <Pressable
        style={styles.sellButton}
        onPress={() => {
          router.push({
            pathname: '../resumenSaliente',
            params: { 
              productosSeleccionados: JSON.stringify(productosSeleccionados()),
            }
          });
        }}
      >
        <Text style={styles.buttonText}>Comprar</Text>
      </Pressable>

      {/* Botón para volver */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.push('./')}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </Pressable>
    </View>
  );
}

export default Saliente;
