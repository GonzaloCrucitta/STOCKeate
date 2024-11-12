import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View, Pressable, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import { agregarProductos, vaciarCarrito} from './redux/store'; // Ruta del archivo store
import styles from './styles';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const Saliente = () => {
  const [articulos, setArticulos] = useState<{ id_producto: number, nombre_producto: string, precio: number, cantidad_stock: number, cantidad_compra:number }[]>([]);
  const dispatch = useDispatch();
  const productosSeleccionados = () => articulos.filter((item) => item.cantidad_compra > 0);
  
  //cargar los productos al entrar a la pagina
  /* useEffect(() => {
    obtenerProductos();
  }, []); */
  useFocusEffect(
    useCallback(() => {
      obtenerProductos(); // Recargar los productos cuando la pantalla reciba el foco
    }, [])
  );
  const obtenerProductos = async () => {
      try {
        const response = await fetch('http://localhost:4000/productos/provedor/'+id);
        if (response.ok) {
          const productos = await response.json();
          console.log("Todos los productos obtenidos: ",productos);
          setArticulos(productos);
        } else {
          Alert.alert('Error', 'No se pudieron obtener los productos.');
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        Alert.alert('Error', 'Hubo un problema al conectar con el servidor.');
      }
    };

  //redux
  interface RootState {
    user: {
      email: string;
      name: string;
      id: number;  
      role: string;
    };
  }

  const id= useSelector((state: RootState) => state.user.id);

  const handleSeleccionarArticulo = (id_producto: number, nombre: string, precio: number, cantidad:number) => {
    dispatch(agregarProductos({ id_producto, nombre, precio, cantidad }));
  };
  const Comprar = async () => {
    var productos = productosSeleccionados();
    vaciarCarrito();
    console.log("Productos: ",productos);
    var i=0;
    while (i<productos.length){
      handleSeleccionarArticulo(productos[i].id_producto,productos[i].nombre_producto,productos[i].precio, productos[i].cantidad_compra);
      console.log('Se agrego al carrito: ',productos[i]);
      i= i+=1;
    }
    if (productos.length>0){
      router.push({
        pathname: '../resumenEntrante',
        params: { 
          productosSeleccionados: JSON.stringify(productosSeleccionados()),
        }
      })
    }
    else{
      alert('No se seleccionaron productos')
    }
  }

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
              value={(item.cantidad_compra || 0).toString()}
              onChangeText={(value) => {
                const cantidad = parseInt(value) || 0; 
                setArticulos(prevArticulos =>
                  prevArticulos.map(producto =>
                    producto.id_producto === item.id_producto
                      ? { ...producto, cantidad_compra: cantidad }
                      : producto
                  )
                );
              }}
            />
          </View>
        )}
        
        style={styles.flatList}
      />

      {/* Botón para ir a la página de resumen */}
      <Pressable
        style={styles.sellButton}
        onPress={()=>Comprar()}
      >
        <Text style={styles.buttonText}>Comprar</Text>
      </Pressable>
    </View>
  );
}

export default Saliente;
