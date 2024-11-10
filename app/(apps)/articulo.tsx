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
  const [isLoading, setIsLoading] = useState(false); // Estado de carga de animación
  
  const router = useRouter();

  interface RootState {
    user: {
      email: string;
      name: string;
      id: number;
    };
  }

  const id = useSelector((state: RootState) => state.user.id); // ID del proveedor

  // Función para seleccionar la imagen
  const agregarImagen = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  // Función para crear el producto
  const crearArticulo = async () => {
    setIsLoading(true);

    // Si hay una imagen, la subimos al servidor
    let imagenUrl = '';
    if (imagen) {
      const formData = new FormData();
      formData.append('archivo', {
        uri: imagen,
        type: 'image/jpeg', // O el tipo correcto de la imagen
        name: 'image.jpg',
      });

      // Subimos la imagen al servidor
      try {
        const imagenResponse = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: formData,
        });

        const imagenData = await imagenResponse.json();
        imagenUrl = imagenData.rutaArchivo; // Obtenemos la ruta de la imagen

        if (!imagenResponse.ok) {
          throw new Error('No se pudo subir la imagen');
        }
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        setIsLoading(false);
        return; // Salimos si no se pudo subir la imagen
      }
    }

    // Ahora creamos el producto con la ruta de la imagen
    const newProducto = {
      nombre_producto: nombre,
      codigo_barras: codigoBarras,
      descripcion: descripcion,
      cantidad_stock: cantidad,
      id_proveedor: id,
      tags: tags[0], // Solo agregamos el primer tag, puedes modificar esto según tus necesidades
      foto: imagenUrl, // Ruta de la imagen que subimos
      precio: precio,
    };

    // Enviamos los datos del producto al servidor
    try {
      const response = await fetch('http://localhost:4000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProducto),
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      const createdProducto = await response.json();
      console.log('Producto creado', createdProducto);

      router.push('./stock'); // Redirigimos a la página de stock

    } catch (error) {
      console.error('Error al crear el producto:', error);
      setIsLoading(false); // Detenemos la carga si hubo un error
    }
  };

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
