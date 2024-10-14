import React, { useState } from 'react';
import { FlatList, Text, View, Pressable, TextInput } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';

const Saliente = () => {
  const [data, setData] = useState([
    { CodigoBarras: '1', titulo: 'mate', stock: 10, cantidadVender: 0, precio: 100 },
    { CodigoBarras: '2', titulo: 'café', stock: 5, cantidadVender: 0, precio: 150 },
    { CodigoBarras: '3', titulo: 'harina', stock: 8, cantidadVender: 0, precio: 50 },
    { CodigoBarras: '4', titulo: 'palmito', stock: 2, cantidadVender: 0, precio: 200 },
    { CodigoBarras: '5', titulo: 'yerba', stock: 20, cantidadVender: 0, precio: 120 },
    { CodigoBarras: '6', titulo: 'mermelada', stock: 8, cantidadVender: 0, precio: 80 },
    { CodigoBarras: '7', titulo: 'cacao', stock: 3, cantidadVender: 0, precio: 90 },
    { CodigoBarras: '8', titulo: 'picadillo', stock: 22, cantidadVender: 0, precio: 60 },
    { CodigoBarras: '9', titulo: 'pate', stock: 3, cantidadVender: 0, precio: 110 },
  ]);

  const productosSeleccionados = data.filter(item => item.cantidadVender > 0);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.text}>{item.titulo}</Text>
            <Text style={styles.stock}>{item.stock} en stock</Text>
            
            {/* Entrada para la cantidad a vender */}
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Cantidad a vender"
              value={item.cantidadVender.toString()}
              onChangeText={(value) => {
                const cantidad = parseInt(value);
                setData(prevData =>
                  prevData.map(producto =>
                    producto.CodigoBarras === item.CodigoBarras
                      ? { ...producto, cantidadVender: isNaN(cantidad) ? 0 : cantidad }
                      : producto
                  )
                );
              }}
            />
          </View>
        )}
        keyExtractor={(item) => item.CodigoBarras}
        style={styles.flatList}
      />

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
        <Text style={styles.buttonText}>Vender</Text>
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
