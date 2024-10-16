import React, { useState } from 'react';
import { FlatList, Text, View, Pressable, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';

const Saliente = () => {
  const [data, setData] = useState([
    { CodigoBarras: '1', titulo: 'mate', stock: 10, cantidadVender: 0, precio: 100 },
    ]);

  const [clientes] = useState([
    { id: '1', name: 'Cliente A' },
    { id: '2', name: 'Cliente B' },
    { id: '3', name: 'Cliente.No.Registrado' },
  ]);

  const [selectedClient, setSelectedClient] = useState(clientes[2]); // Cliente por defecto
  const [modalVisible, setModalVisible] = useState(false); // Control del Modal de cliente
  const [addItemModalVisible, setAddItemModalVisible] = useState(false); // Control del Modal de agregar item
  const [newItem, setNewItem] = useState({ titulo: '', stock: '', precio: '' }); // Datos del nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState(data);

  const productosSeleccionados = data.filter(item => item.cantidadVender > 0);


  const buscarProducto = (texto: string) => {
    setNuevoProducto(texto);
    const productosFiltrados = data.filter((producto) =>
      producto.titulo.toLowerCase().includes(texto.toLowerCase())
    );
    setProductosFiltrados(productosFiltrados);
  };
  
  // Función para agregar un nuevo producto
  const handleAddNewItem = () => {
    if (!newItem.titulo || !newItem.stock || !newItem.precio) {
      Alert.alert('Error', 'Por favor, rellena todos los campos.');
      return;
    }

    const nuevoProducto = {
      CodigoBarras: (data.length + 1).toString(), // Genera un nuevo código de barras
      titulo: newItem.titulo,
      stock: parseInt(newItem.stock),
      cantidadVender: 0,
      precio: parseInt(newItem.precio),
    };

    setData([...data, nuevoProducto]); // Agregar el nuevo producto a la lista
    setAddItemModalVisible(false); // Cerrar el modal
    setNewItem({ titulo: '', stock: '', precio: '' }); // Limpiar el formulario
  };

  return (
    <View style={styles.container}>

      {/* Botón para seleccionar cliente */}
      <Text style={styles.label}>Seleccionar Cliente:</Text>
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

      {/* Botón para agregar nuevo producto */}
      <Pressable
        style={styles.addButton}
        onPress={() => setAddItemModalVisible(true)}
      >
        <Text style={styles.buttonText}>Agregar Nuevo Producto</Text>
      </Pressable>

      {/* Modal para agregar nuevo producto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addItemModalVisible}
        onRequestClose={() => setAddItemModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buscar Producto</Text>

            {/* Entrada para el nombre del producto */}
            <TextInput
              style={styles.input}
              placeholder="Nombre del Producto"
              value={newItem.titulo}
              //onChangeText={buscarProducto}
              onChangeText={(text) => setNewItem({ ...newItem, titulo: text })}
            />

            {/* Entrada para el stock */}
            <TextInput
              style={styles.input}
              placeholder="Cantidad en stock"
              keyboardType="numeric"
              value={newItem.stock}
              onChangeText={(text) => setNewItem({ ...newItem, stock: text })}
            />

            {/* Entrada para el precio */}
            <TextInput
              style={styles.input}
              placeholder="Precio"
              keyboardType="numeric"
              value={newItem.precio}
              onChangeText={(text) => setNewItem({ ...newItem, precio: text })}
            />

            {/* Botón para confirmar el nuevo producto */}
            <Pressable
              style={styles.confirmButton}
              onPress={handleAddNewItem}
            >
              <Text style={styles.buttonText}>Agregar Producto</Text>
            </Pressable>

            {/* Botón para cerrar el modal */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setAddItemModalVisible(false)}
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
