import React, { useState } from 'react';
import { FlatList, Text, View, Pressable, TextInput, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Saliente = () => {
  const [bd, setbd] = useState([
    { CodigoBarras: '1', titulo: 'mate', stock: 10, cantidadVender: 0, precio: 100 },
    { CodigoBarras: '12', titulo: 'arvejas', stock: 11, cantidadVender: 0, precio:20 },
    { CodigoBarras: '13', titulo: 'sardinas', stock: 15, cantidadVender: 0, precio:15 },
    { CodigoBarras: '14', titulo: 'atún', stock: 4, cantidadVender: 0, precio:18 },
    { CodigoBarras: '15', titulo: 'choclo', stock: 17, cantidadVender: 0, precio:12 },
    { CodigoBarras: '16', titulo: 'lentejas', stock: 19, cantidadVender: 0, precio:9 },
    ]);
    /* 
    model Product {
  id_producto    Int      @id @default(autoincrement())
  nombre_producto String
  codigo_barras   String
  descripcion     String
  cantidad_stock  Int
  id_proveedor    Int
  proveedor       Proveedor @relation(fields: [id_proveedor], references: [id_proveedor])
  precio          Float
  detallesPedido  OrderDetail[]
  depositos       DepositoProduct[]  // Relación con la tabla intermedia
} */
  const [data, setData] = useState([
    { CodigoBarras: '', titulo: '', stock: 0, cantidadVender: 0, precio: 0 },
    ]);

  const [clientes] = useState([
    { id: '1', name: 'Cliente A' },
    { id: '2', name: 'Cliente B' },
    { id: '3', name: 'Cliente No habitual' },
  ]);

  const [selectedClient, setSelectedClient] = useState(clientes[2]); // Cliente por defecto
  const [modalVisible, setModalVisible] = useState(false); // Control del Modal de cliente
  const [addItemModalVisible, setAddItemModalVisible] = useState(false); // Control del Modal de agregar item
  const [newItem, setNewItem] = useState({ titulo: '', stock: '', precio: '' }); // Datos del nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState(data);

  const productosSeleccionados = data.filter(item => item.cantidadVender > 0);

  const buscarEnBD = (texto: string) => {
    setNuevoProducto(texto);
    const productosFiltrados = bd
    .filter((producto) => producto.titulo.toLowerCase().includes(texto.toLowerCase()))
    .slice(0,5);
    ;
    setProductosFiltrados(productosFiltrados);
  };
  
  // Función para agregar un nuevo producto
  const handleAddNewItem = () => {
    const existeProducto = data.some(
      (producto) => producto.titulo.toLowerCase() === newItem.titulo.toLowerCase()
    );
    
    if (existeProducto) {
      Alert.alert('Error', 'El producto ya ha sido agregado.');
      return;
    }
    if (!newItem.titulo || !newItem.stock || !newItem.precio) {
      Alert.alert('Error', 'Por favor, rellena todos los campos.');
      return;
    }

    const nuevoProducto = {
      CodigoBarras: (data.length + 1).toString(), // Genera un nuevo código de barra
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

      {/* Botón para abrir modal de agregar nuevo producto */}
      <Pressable
        style={styles.addButton}
        onPress={() => setAddItemModalVisible(true)}
      >
        <Text style={styles.buttonText}>Agregar Nuevo Producto</Text>
      </Pressable>

      {/* Modal para buscar nuevo producto */}
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
              onChangeText={(text) => {
                setNewItem({ ...newItem, titulo: text });
                buscarEnBD(text);}}
            />
            
            {/* Lista desplegable de productos filtrados */}
            {productosFiltrados.length > 0 && (
              <ScrollView style={styles.filteredListContainer}>
              {productosFiltrados.map((producto) => (
                <Pressable
                  key={producto.CodigoBarras}
                  style={styles.productItem}
                  onPress={() => {
                    setNewItem({
                      titulo: producto.titulo,
                      stock: producto.stock.toString(),
                      precio: producto.precio.toString(),
                    });
                    setProductosFiltrados([]); // Limpia la lista después de seleccionar un producto
                  }}
                >
                  <Text>{producto.titulo}</Text>
                </Pressable>
              ))}
            </ScrollView>
            )}
              
              {/*<FlatList
                data={productosFiltrados}
                keyExtractor={(item) => item.CodigoBarras}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setNewItem({ ...newItem, titulo: item.titulo, stock: item.stock.toString(), precio: item.precio.toString() });
                      setProductosFiltrados([]); // Limpia la lista desplegable al seleccionar
                    }}
                  >
                    <Text style={styles.productItem}>{item.titulo}</Text>
                  </Pressable>
                )}
              />*/}




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
              <Text style={styles.buttonText}>Atras</Text>
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
            <Text style={styles.stock}>${item.precio}</Text>
            
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
            {/* Botón para eliminar el producto */}
            <TouchableOpacity
              onPress={() => {
                setData(prevData => prevData.filter(producto => producto.CodigoBarras !== item.CodigoBarras));
              }}
            >
              <FontAwesome name="times" size={24} color="red" />
            </TouchableOpacity>
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

      
    </View>
  );
}

export default Saliente;
