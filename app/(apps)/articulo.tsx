import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import styles from './styles';

const ArticuloProveedor = () => {
  // Estados para manejar los datos del artículo
  const [nombre, setNombre] = useState('Nombre del producto');
  const [codigoBarras, setCodigoBarras] = useState('1234567890');
  const [tags, setTags] = useState(['electrónica', 'hogar']);
  const [cantidad, setCantidad] = useState(10);
  const [descripcion, setDescripcion] = useState('Descripción del producto');
  const [imagenes, setImagenes] = useState([
    require('../../components/producto.png'),
    require('../../components/producto.png')//aca estarian todas las imagenes del producto
  ]);

  // Función para agregar un nuevo tag
  const agregarTag = (nuevoTag: string) => {
    setTags([...tags, nuevoTag]);
  };

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
      <Pressable style={styles.pressableButton} onPress={() => agregarTag('nuevoTag')}>
                <Text style={styles.buttonText}>Agregar Tag</Text>
      </Pressable>
      {/* Cantidad */}
      <Text style={styles.stock}>Cantidad en stock:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cantidad.toString()}
        onChangeText={(value) => setCantidad(parseInt(value))}
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
        
      <Pressable style={styles.pressableButton} onPress={() => router.push('../stock')}>
                <Text style={styles.buttonText}>Confirmar</Text>
        </Pressable>
    </ScrollView>
  );
}

export default ArticuloProveedor;
/*

});
*/
