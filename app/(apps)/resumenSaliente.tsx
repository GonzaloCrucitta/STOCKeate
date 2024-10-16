import React, { useState } from 'react';
import { FlatList, Text, View, Pressable, TextInput } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';

const Saliente = () => {
  const [data, setData] = useState([
    { CodigoBarras: '1', titulo: 'mate', stock: 10, cantidadVender: 2, precio: 100 },
    { CodigoBarras: '4', titulo: 'palmito', stock: 2, cantidadVender: 1, precio: 200 },
    { CodigoBarras: '5', titulo: 'yerba', stock: 20, cantidadVender: 5, precio: 120 },
    { CodigoBarras: '8', titulo: 'picadillo', stock: 22, cantidadVender: 1, precio: 60 },
    { CodigoBarras: '9', titulo: 'pate', stock: 3, cantidadVender: 2, precio: 110 },
  ]);

  const productosSeleccionados = data.filter(item => item.cantidadVender > 0);
  const total = productosSeleccionados.reduce((acc,item)=>{
    return acc + (item.precio * item.cantidadVender);
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
        <Text style={styles.text}>articulo, cantidad, precio</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        ListHeaderComponent={ListHeader} // Agregando el encabezado a la FlatList
        renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.text}>{item.titulo}</Text>
              <Text style={styles.stock}>{item.cantidadVender}</Text>
              <Text style={[styles.text, { textAlign: 'right' }]}>   ${item.precio * item.cantidadVender} </Text>
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
        onPress={() => {
          router.push({
            pathname: '../resumenSaliente',
            params: { productosSeleccionados: JSON.stringify(productosSeleccionados) }
          });
        }}
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
