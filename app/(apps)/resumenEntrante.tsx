import React, { useState } from 'react';
import { FlatList, Text, View, Pressable, TextInput } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { vaciarCarrito } from './redux/store';

const Entrante = () => {

  interface CarritoItem {
    id_producto: number;
    nombre: string;
    cantidad: number;
    precio: number;
  }
  interface CarritoState {
    items: CarritoItem[];
  }  
  interface UserState {
    email: string;
    name: string;
    id: number;  
    role: string;
  }
  interface RootState {
    user: UserState;
    carrito: CarritoState;
  }
  const carritoItems = useSelector((state: RootState) => state.carrito.items);
  const id= useSelector((state: RootState) => state.user.id);
  async function ConfirmarCompra() {
    for (const item of carritoItems) {
      let Producto = {
        cantidad_stock: item.cantidad,
        precio: item.precio
      };
      //Obtener la cantidad de articulos antes de hacerle un put
      try {
        const response = await   fetch("http://localhost:4000/productos/"+item.id_producto, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          },
           
        });
        if (!response.ok) {
          throw new Error('Failed to get product');
        }
        
        const Productoenbd = await response.json();
        console.log('se obtiene el get', Productoenbd);
        Producto.cantidad_stock+=Productoenbd.cantidad_stock; //cantidad despues de la compra
      } catch (error) {
          console.error('Error al obtener el producto:', error);
          console.error('producto:',Producto);
      }
      
      console.log("se intenta hacer PUT con: "+JSON.stringify(Producto))
      
       try {
        const putResponse = await   fetch("http://localhost:4000/productos/"+item.id_producto, {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(Producto), 
        })
        if (!putResponse.ok) {
          throw new Error('Failed to upload product');
        }
        console.log('Producto actualizado', await putResponse.json());
      } catch (error) {
          console.error('Error al crear el producto:', error);
          console.error('producto:',item);
      } 
    }
    vaciarCarrito();
    router.push("./main_providers");
  }

  const total = carritoItems.reduce((acc,item)=>{
    return acc + (item.precio * item.cantidad);
    }, 0);
  const ListHeader = () => (
    <View style={styles.row}>
      <Text style={styles.headerText}>Artículo</Text>
      <Text style={styles.headerText}>Cantidad</Text>
      <Text style={styles.headerText}>Precio</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={carritoItems}
        ListHeaderComponent={ListHeader} // Agregando el encabezado a la FlatList
        renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.text}>{item.nombre}</Text>
              <Text style={styles.stock}>{item.cantidad}</Text>
              <Text style={[styles.text, { textAlign: 'right' }]}>   ${item.precio * item.cantidad} </Text>
              {/* Entrada para la cantidad a vender */}
            </View>
        )}
        style={styles.flatList}
      />
      <Text style={styles.text}>total: ${total}</Text>

      {/* Botón para ir a la página de resumen */}
      <Pressable
        style={styles.sellButton}
        onPress={()=>ConfirmarCompra() }
      >
        <Text style={styles.buttonText}>Confirmar</Text>
      </Pressable>

      {/* Botón para volver */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.push('../main_providers')}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </Pressable>
    </View>
  );
}

export default Entrante;
