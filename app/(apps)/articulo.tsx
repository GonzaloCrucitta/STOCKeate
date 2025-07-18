import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './styles';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

const ArticuloProveedor = () => {
  // Estados para manejar los datos del artículo
  const [nombre, setNombre] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [cantidad, setCantidad] = useState(0);
  const [preciocompra, setPreciocompra] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  interface RootState {
    user: {
      email: string;
      name: string;
      id: number;
    };
  }

  const id = useSelector((state: RootState) => state.user.id);

  const handlePrecioChange = (value: string) => {
    const isValidInput = /^(\d*\.?\d*)$/.test(value);
    if (isValidInput) {
      setPrecio(value);
    }
  };

  const handlePreciocompraChange = (value: string) => {
    const isValidInput = /^(\d*\.?\d*)$/.test(value);
    if (isValidInput) {
      setPreciocompra(value);
    }
  };

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

  const subirImagen = async (uri: string | null) => {
    if (!uri) return;

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('archivo', blob, 'imagen.jpg');

      const uploadResponse = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + '/foto/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();
      if (uploadResponse.ok) {
        console.log('Imagen subida exitosamente:', result);
        return result.rutaArchivo;
      } else {
        console.error('Error al subir la imagen:', result);
      }
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
    }
  };

  // Función para crear el producto
  const crearArticulo = async () => {
    setIsLoading(true);
    var imagenUrl = await subirImagen(imagen);
    if (!imagen) {
      imagenUrl = 'articulo_por_defecto.png';
    }
    const newProducto = {
      nombre_producto: nombre,
      codigo_barras: codigoBarras,
      descripcion: descripcion,
      cantidad_stock: cantidad,
      id_proveedor: id,
      precio: Number(precio) * 1.2,
      tags: tags.join(','),
      foto: imagenUrl.split('\\').pop(),
      preciocompra: Number(preciocompra),
    };

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + '/productos', {
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
      setIsLoading(false);
      setNombre('');
      setCodigoBarras('');
      setTags([]);
      setCantidad(0);
      setPreciocompra('');
      setPrecio('');
      setDescripcion('');
      setImagen(null);
      setShowTags(false);
      setTag('');
      router.push('/stock'); // <-- CAMBIO AQUÍ
    } catch (error) {
      console.error('Error al crear el producto:', error);
      setIsLoading(false);
    }
  };

  // Tags
  const agregarTag = (nuevoTag: string) => {
    if (nuevoTag.trim() !== '') {
      setTags([...tags, nuevoTag]);
      setTag('');
      setShowTags(false);
    }
  };
  const [showTags, setShowTags] = useState(false);
  const [tag, setTag] = useState('');

  const eliminarTag = (index: number) => {
    const nuevosTags = tags.filter((_, i) => i !== index);
    setTags(nuevosTags);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f6f8fa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container_articulo}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 40,
          minWidth: 0,
          maxWidth: 500,
          alignSelf: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.mainTitle, { fontSize: 22, marginBottom: 18 }]}>Nuevo Artículo</Text>

        {/* Nombre del producto */}
        <Text style={styles.stock}>Nombre del producto:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el nombre del producto"
          value={nombre}
          onChangeText={setNombre}
        />

        {/* Código de barras */}
        <Text style={styles.stock}>Código de barras:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el código de barras"
          value={codigoBarras}
          onChangeText={setCodigoBarras}
        />

        {/* Tags */}
        <Text style={styles.stock}>Tags:</Text>
        <FlatList
          horizontal
          data={tags}
          renderItem={({ item, index }) => (
            <Pressable key={index} onLongPress={() => eliminarTag(index)}>
              <Text style={styles.tag}>{item}</Text>
            </Pressable>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ marginBottom: 8 }}
        />

        {/* Opción para agregar un nuevo tag */}
        {!showTags && (
          <Pressable style={styles.pressableButton} onPress={() => setShowTags(true)}>
            <Text style={styles.buttonText}>Agregar Tag</Text>
          </Pressable>
        )}

        {showTags && (
          <View style={styles.loginFields}>
            <TextInput
              style={styles.input}
              placeholder="Ingrese tag"
              value={tag}
              onChangeText={setTag}
            />
            <Pressable style={styles.pressableButton} onPress={() => agregarTag(tag)}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </Pressable>
          </View>
        )}

        {/* Cantidad */}
        <Text style={styles.stock}>Cantidad en stock:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ingrese la cantidad en stock"
          value={cantidad.toString()}
          onChangeText={(value) => setCantidad(Number(value) || 0)}
        />

        {/* Precio de compra */}
        <Text style={styles.stock}>Precio de compra:</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="Ingrese el precio de compra"
          value={preciocompra.toString()}
          onChangeText={handlePreciocompraChange}
        />

        {/* Precio de venta */}
        <Text style={styles.stock}>Precio de venta:</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="Ingrese el precio de venta"
          value={precio.toString()}
          onChangeText={handlePrecioChange}
        />

        {/* Descripción */}
        <Text style={styles.stock}>Descripción del producto:</Text>
        <TextInput
          style={[styles.input, { minHeight: 60 }]}
          multiline
          placeholder="Ingrese la descripción del producto"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        {/* Imágen del producto */}
        <Text style={styles.stock}>Imagen del producto (mantener para borrar):</Text>
        {imagen && (
          <Pressable onLongPress={() => setImagen(null)}>
            <Image source={{ uri: imagen }} style={styles.image_articulo} />
          </Pressable>
        )}

        <Pressable style={styles.pressableButton} onPress={agregarImagen}>
          <Text style={styles.buttonText}>Seleccionar imagen</Text>
        </Pressable>

        <Pressable
          style={[styles.pressableButton, isLoading && { opacity: 0.7 }]}
          onPress={crearArticulo}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Guardando...' : 'Confirmar'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
      );
    };

export default ArticuloProveedor;