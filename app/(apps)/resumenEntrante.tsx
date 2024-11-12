import React, { useState } from 'react';
import { FlatList,Modal ,Text, View, Pressable, TextInput } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
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
  const [preciototal, setTotal] = useState(0);
  const [preciosEditados, setPreciosEditados] = useState<{ [key: number]: number }>({});//lista de precios
  const handlePrecio = (idProducto: number, nuevoPrecio: string) => {
    const precio = parseFloat(nuevoPrecio) || 0;
    setPreciosEditados((prev) => ({
      ...prev,
      [idProducto]: precio,
    }));
    
     // Recalcula el total en función de los precios actualizados
  const nuevoTotal = carritoItems.reduce((acc, item) => {
    const precioUnitario = preciosEditados[item.id_producto] || item.precio;
    return acc + (precioUnitario * item.cantidad);
  }, 0);
  setTotal(nuevoTotal);
  };
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleConfirmarCompra = () => {
    setIsModalVisible(true);
  };
  const confirmarCompraEnModal = () => {
    setIsModalVisible(false);
    ConfirmarCompra();
  };
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
    dispatch(vaciarCarrito());
    router.push("./main_providers");
  }

  const total = carritoItems.reduce((acc,item)=>{
    return acc + (item.precio * item.cantidad);
    }, 0);
  const ListHeader = () => (
    <View style={styles.row}>
      <Text style={styles.headerText_resumen}>Artículo</Text>
      <Text style={styles.headerText_resumen}>Cantidad</Text>
      <Text style={styles.headerText_resumen}>Precio por unidad</Text>
      <Text style={styles.headerText_resumen}>Precio total</Text>
    </View>
  );
  return (
    <View style={styles.container_resumen}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={carritoItems}
        ListHeaderComponent={ListHeader} // Agregando el encabezado a la FlatList
        renderItem={({ item }) => (
            <View style={styles.itemContainer_resumen}>
              <Text style={styles.text}>{item.nombre}</Text>
              <Text style={styles.stock_resumen}>{item.cantidad}</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                //value={(preciosEditados[item.id_producto] ?? item.precio).toString()}
                value={preciosEditados[item.id_producto]?.toString() || item.precio.toString()}
                onChangeText={(text) => handlePrecio(item.id_producto, text)}
              />
            <Text style={[styles.text, { textAlign: 'right' }]}>
              ${((preciosEditados[item.id_producto] || item.precio) * item.cantidad)}
            </Text>
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
    </View>
  );
}

export default Entrante;
