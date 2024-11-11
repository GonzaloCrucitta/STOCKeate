import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import styles from './styles';
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
        console.log(result.assets[0].uri)
      setImagen(result.assets[0].uri);
    }

  };

  const subirImagen = async (uri: string | null) => {
    if (!uri) return;

    try {
        // Obtén el Blob desde la URI de la imagen
        const response = await fetch(uri);
        const blob = await response.blob();

        // Configura el FormData y añade el Blob con un nombre y tipo
        const formData = new FormData();
        formData.append('archivo', blob, 'imagen.jpg'); // Añade el nombre del archivo aquí

        // Realiza la solicitud
        const uploadResponse = await fetch('http://localhost:4000/foto/upload', {
            method: 'POST',
            body: formData,
            // No especifiques Content-Type manualmente
        });

        const result = await uploadResponse.json();
        if (uploadResponse.ok) {
            console.log('Imagen subida exitosamente:', result);
            return result;
        } else {
            console.error('Error al subir la imagen:', result);
        }

    } catch (error) {
        console.error('Error en la solicitud POST:', error);
    }
};

  
  const crearArticulo = async (uri:string | null) => {
    if (!imagen) return;
    var imagenData = await subirImagen(uri);
    console.log(imagenData.rutaArchivo);
    /*
      // Obtener la URL de la imagen subida
      const imagenUrl = imagenData.rutaArchivo;  // Suponiendo que el servidor te devuelve la ruta de la imagen subida
  
      // Ahora que tenemos la URL de la imagen, podemos crear el producto
      const newProducto = {
        nombre_producto: nombre,
        codigo_barras: codigoBarras,
        descripcion: descripcion,
        cantidad_stock: cantidad,
        id_proveedor: id,
        tags: tags[0],  // Solo agregamos el primer tag, puedes modificar esto según tus necesidades
        foto: imagenUrl || 'http://localhost:4000/default-image.jpg', // Ruta de la imagen que subimos o por defecto
        precio: precio,
      };
  
      // Enviar los datos del producto al servidor
      const responseProducto = await fetch('http://localhost:4000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProducto),
      });
  
      if (!responseProducto.ok) {
        throw new Error('Error al crear el producto');
      }
  
      const createdProducto = await responseProducto.json();
      console.log('Producto creado', createdProducto);
  
      router.push('./stock');  // Redirigimos a la página de stock
    } catch (error) {
      console.error('Error al subir la imagen o crear el producto:', error);
      setIsLoading(false);  // Detenemos la carga si hubo un error
    }
    */
  };
  
  // Función para crear el producto
  

  return (
    <ScrollView style={styles.container_articulo}>
      
      <Text style={styles.stock}>imagen: </Text>
      <Pressable onLongPress={() => setImagen(null)}>
        <Image
          source={{ uri: imagen || 'http://localhost:4000/default-image.jpg' }} // Imagen por defecto si no hay seleccionada
          style={styles.image_articulo}
        />
      </Pressable>

      <Pressable style={styles.pressableButton} onPress={() => agregarImagen()}>
        <Text style={styles.buttonText}>Seleccionar imagen</Text>
      </Pressable>

      <Pressable style={styles.pressableButton} onPress={() => crearArticulo(imagen)} disabled={isLoading}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ArticuloProveedor;
