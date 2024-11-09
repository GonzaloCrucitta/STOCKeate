import React, { useState } from 'react';
import { FlatList, Text, View, Pressable, TextInput } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';

const Saliente = () => {
  const [data, setData] = useState([
    { id:1, CodigoBarras: '1', titulo: 'mate', stock: 10, cantidadVender: 2, preciocompra: 100 },
    { id:2, CodigoBarras: '4', titulo: 'palmito', stock: 2, cantidadVender: 1, preciocompra: 200 },
    { id:3, CodigoBarras: '5', titulo: 'yerba', stock: 20, cantidadVender: 5, preciocompra: 120 },
    { id:4, CodigoBarras: '8', titulo: 'picadillo', stock: 22, cantidadVender: 1, preciocompra: 60 },
    { id:5, CodigoBarras: '9', titulo: 'pate', stock: 3, cantidadVender: 2, preciocompra: 110 },
  ]);
  

  async function ConfirmarCompra(){
    var i = 0;
    while (i<data.length){
      var Producto = {
        cantidad_stock: data[i].cantidadVender,
        precio: data[i].preciocompra
      };
      try {
        const response = await   fetch("http://localhost:4000/productos/"+data[i].id, {
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
        Producto.cantidad_stock=Producto.cantidad_stock+Productoenbd.cantidad_stock;
      } catch (error) {
          console.error('Error al obtener el producto:', error);
          console.error('producto:',data[i]);
      }
      
      console.log("se intenta hacer PUT con: "+JSON.stringify(Producto))
      
       try {
        const response = await   fetch("http://localhost:4000/productos/"+data[i].id, {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(Producto), 
        })
        if (!response.ok) {
          throw new Error('Failed to upload product');
        }
        
        const newProducto = await response.json();
        console.log('Producto creado', newProducto);
      } catch (error) {
          console.error('Error al crear el producto:', error);
          console.error('producto:',data[i]);
      } 
      i=i+1;
    }
  }
  const productosSeleccionados = data.filter(item => item.cantidadVender > 0);
  const total = productosSeleccionados.reduce((acc,item)=>{
    return acc + (item.preciocompra * item.cantidadVender);
    }, 0);
  const ListHeader = () => (
    <View style={styles.row}>
      <Text style={styles.headerText}>Artículo</Text>
      <Text style={styles.headerText}>Cantidad</Text>
      <Text style={styles.headerText}>Precio de compra</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        ListHeaderComponent={ListHeader} // Agregando el encabezado a la FlatList
        renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.text}>{item.titulo}</Text>
              <Text style={styles.stock}>{item.cantidadVender}</Text>
              <Text style={[styles.text, { textAlign: 'right' }]}>   ${item.preciocompra * item.cantidadVender} </Text>
              {/* Entrada para la cantidad a vender */}
            </View>
        )}
        keyExtractor={(item) => item.CodigoBarras}
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

export default Saliente;

/*
const styles = StyleSheet.create({
  
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  stock: {
    fontSize: 14,
    color: '#888',
  },
  input: {
    width: 60,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    marginLeft: 8,
  },
  flatList: {
    marginBottom: 16,
  },
  sellButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

//export default styles;
*/
