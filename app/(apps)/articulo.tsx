import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import styles from './styles';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

const ArticuloProveedor = () => {
  // Estados para manejar los datos del artículo
  const [nombre, setNombre] = useState('Nombre del producto');
  const [codigoBarras, setCodigoBarras] = useState('1234567890');
  const [tags, setTags] = useState(['electrónica', 'hogar']);
  const [cantidad, setCantidad] = useState(10);
  const [precio, setPrecio] = useState(10);
  const [descripcion, setDescripcion] = useState('Descripción del producto');
  const [imagen, setImagen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);  // Estado de carga de animacion

  
interface RootState {
  user: {
    email: string;
    name: string;
    id: number;  // Aquí debes usar 'number' en lugar de 'int' en TypeScript
  };
}
const id= useSelector((state: RootState) => state.user.id);
  //imagepicker
  const agregarImagen = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
      console.log(result);

      if (!result.canceled) {
        setImagen(result.assets[0].uri)
      }
    };

  const newProducto = {

    nombre_producto: nombre,
    codigo_barras: codigoBarras,
    descripcion: descripcion,
    cantidad_stock: cantidad,
    id_proveedor:id ,
    tags: tags[0], 
    foto:"",
    precio: precio

  };


  async function crearArticulo(producto: any) {
    setIsLoading(true);
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
      router.push('./stock')
      } catch (error) {
        console.error('Error al crear el producto:', error);
        console.error('producto:',producto);
        setIsLoading(true);//por si tira error, se puede volver a intentar
      }
      }
     

  // Función para agregar un nuevo tag
  const agregarTag = (nuevoTag: string) => {
    setTags([...tags, nuevoTag]);
    setShowTags(!showTags);

  };
  const [showTags, setShowTags] = useState(false);
  const [tag, setTag] = useState('');

  
  const eliminarImagen = (index: number) => {
    setImagen(null);
  };

  const eliminarTag = (index: number) => {
    const nuevosTags = tags.filter((_, i) => i !== index);
    setTags(nuevosTags);
  }

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
        renderItem={({ item,index }) => (
          <Pressable onLongPress={() => eliminarTag(index)}>
          <Text style={styles.tag}>{item}</Text>
        </Pressable> 
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
      
      />

      {/* Descripción */}
      <Text style={styles.stock}>Descripción del producto:</Text>
      <TextInput
        style={styles.input}
        multiline
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {/* Imágen del producto */}
      <Text style={styles.stock}>Imágen del producto (Mantene para borrar):</Text>
      {imagen && (
        <Pressable onLongPress={() => setImagen(null)}>
          <Image source={{ uri: imagen }} style={styles.image_articulo} />
        </Pressable>
      )}
        
      <Pressable style={styles.pressableButton} onPress={() => agregarImagen()}>
                <Text style={styles.buttonText}>Seleccionar imagen</Text>
      </Pressable>
      

      <Pressable style={styles.pressableButton} onPress={() => crearArticulo(newProducto)} disabled={isLoading}>
                <Text style={styles.buttonText}>Confirmar</Text>
        </Pressable>
    </ScrollView>
  );
}

export default ArticuloProveedor;
