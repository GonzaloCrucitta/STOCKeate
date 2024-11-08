import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import styles from './styles';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

const ArticuloProveedor = () => {
  // Estados para manejar los datos del artículo
  const [nombre, setNombre] = useState('Nombre del producto');
  const [codigoBarras, setCodigoBarras] = useState('1234567890');
  const [tags, setTags] = useState(['electrónica', 'hogar']);
  const [cantidad, setCantidad] = useState(10);
  const [precio, setPrecio] = useState(10);
  const [descripcion, setDescripcion] = useState('Descripción del producto');
  const [imagenes, setImagenes] = useState([
    require('../../components/producto.png'),
    require('../../components/producto.png')//aca estarian todas las imagenes del producto
  ]);
  
interface RootState {
  user: {
    email: string;
    name: string;
    id: number;  // Aquí debes usar 'number' en lugar de 'int' en TypeScript
  };
}
const id= useSelector((state: RootState) => state.user.id);
  const newProducto = {

    nombre_producto: nombre,
    codigo_barras: codigoBarras,
    descripcion: descripcion,
    cantidad_stock: cantidad,
    id_proveedor:id ,
    tags: tags[0], 
    precio: precio

  };


  async function crearArticulo(producto: any) {
    try {
      const response = await   fetch("http://localhost:4000/productos", {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
     
      });
     
      if (!response.ok) {
        throw new Error('Failed to upload product');
      }
      
      const newProducto = await response.json();
      console.log('Producto creado', newProducto);
      } catch (error) {
        console.error('Error al crear el producto:', error);
        console.error('producto:',producto);
      }
      }
     

  // Función para agregar un nuevo tag
  const agregarTag = (nuevoTag: string) => {
    setTags([...tags, nuevoTag]);
    setShowTags(!showTags);

  };
  const [showTags, setShowTags] = useState(false);
  const [tag, setTag] = useState('');

  // Función para agregar una nueva imagen
  const agregarImagen = (nuevaImagen: any) => {
    setImagenes([...imagenes, nuevaImagen]);
  };

  return (
    <ScrollView style={styles.container_articulo}>
      {/* Nombre del producto */}
      <Text style={styles.stock}>Nombre del producto:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Código de barras */}
      <Text style={styles.stock}>Código de barras:</Text>
      <TextInput
        style={styles.input}
        value={codigoBarras}
        onChangeText={setCodigoBarras}
      />

      {/* Tags */}
      <Text style={styles.stock}>Tags:</Text>
      <FlatList
        horizontal
        data={tags}
        renderItem={({ item }) => (
          <Text style={styles.tag}>{item}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* Opción para agregar un nuevo tag */}
      {!showTags &&
      <Pressable style={styles.pressableButton} 
        onPress={() => setShowTags(!showTags)}>
                <Text style={styles.buttonText}>Agregar Tag</Text>
      </Pressable>}

      {showTags && (
          <View style={styles.loginFields}>
            <TextInput
              style={styles.input}
              placeholder="ingrese tag"
              value={tag}
              onChangeText={setTag}
            />
            <Pressable style={styles.pressableButton} 
              onPress={() => agregarTag(tag) }>
              <Text style={styles.buttonText}>Confirmar</Text>
            </Pressable>
          </View>
        )}

      {/* Cantidad */}
      <Text style={styles.stock}>Cantidad en stock:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cantidad.toString()}
        onChangeText={(value) => setCantidad(parseInt(value))}
      />

      {/* Precio */}
      <Text style={styles.stock}>Precio:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={precio.toString()}
        
        onSubmitEditing={(event) => {
          const nuevoPrecio = parseFloat(event.nativeEvent.text);
          if (!isNaN(nuevoPrecio)) {
              setPrecio(nuevoPrecio);
          }
        }}
      
        //onChangeText={(value) => setPrecio(parseFloat(value))}
      />

      {/* Descripción */}
      <Text style={styles.stock}>Descripción del producto:</Text>
      <TextInput
        style={styles.input}
        multiline
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {/* Imágenes del producto */}
      <Text style={styles.stock}>Imágenes del producto:</Text>
      <FlatList
        horizontal
        data={imagenes}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image_articulo} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Pressable style={styles.pressableButton} onPress={() => agregarImagen(require('../../components/producto.png'))}>
                <Text style={styles.buttonText}>Agregar Imagen</Text>
        </Pressable>
        
      <Pressable style={styles.pressableButton} onPress={() => crearArticulo(newProducto)}>
                <Text style={styles.buttonText}>Confirmar</Text>
        </Pressable>
    </ScrollView>
  );
}

export default ArticuloProveedor;
