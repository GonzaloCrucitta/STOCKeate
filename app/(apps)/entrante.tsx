import React, { useState } from 'react';
import { FlatList, Text, View, Pressable, TextInput, Modal, TouchableOpacity } from 'react-native';
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

  const [clientes] = useState([
    { id: '1', name: 'Proveedor A' },
    { id: '2', name: 'Proveedor B' },
    { id: '3', name: 'Proveedor No habitual' },
  ]);

  const [selectedClient, setSelectedClient] = useState(clientes[2]); // Cliente por defecto
  const [modalVisible, setModalVisible] = useState(false); // Control del Modal

  const productosSeleccionados = data.filter(item => item.cantidadVender > 0);

  return (
    <View style={styles.container}>

      <Text style={styles.label}>Seleccionar Proovedor:</Text>
      <Pressable
        style={styles.clientButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>{selectedClient.name}</Text>
      </Pressable>

      {/* Modal para seleccionar cliente */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un cliente</Text>
            {clientes.map(cliente => (
              <TouchableOpacity
                key={cliente.id}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedClient(cliente);
                  setModalVisible(false); // Cerrar el modal
                }}
              >
                <Text style={styles.modalText}>{cliente.name}</Text>
              </TouchableOpacity>
            ))}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Listado de productos */}
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
            params: { 
              productosSeleccionados: JSON.stringify(productosSeleccionados),
              clienteSeleccionado: JSON.stringify(selectedClient)
            }
          });
        }}
      >
        <Text style={styles.buttonText}>Comprar</Text>
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
