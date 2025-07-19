import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput, Image, Pressable, ScrollView, FlatList } from 'react-native';
import styles from './styles';
import * as ImagePicker from 'expo-image-picker';

const EditarArticulo = () => {
  const { id_Articulo } = useLocalSearchParams();
  const router = useRouter();

  // Estados igual que en articulo.tsx
  const [nombre, setNombre] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [cantidad, setCantidad] = useState(0);
  const [preciocompra, setPreciocompra] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const productoDefault = '../../components/producto.png';


  // Para agregar tags
  const [showTags, setShowTags] = useState(false);
  const [tag, setTag] = useState('');

  // Cargar datos del artículo
  useEffect(() => {
    const cargarArticulo = async () => {
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + '/productos/' + id_Articulo);
      const data = await response.json();
      setNombre(data.nombre_producto ?? '');
      setCodigoBarras(data.codigo_barras ?? '');
      setTags(data.tags ? data.tags.split(',') : []);
      setCantidad(data.cantidad_stock ?? 0);
      setPreciocompra((data.preciocompra ?? '').toString());
      setPrecio((data.precio ?? '').toString());
      setDescripcion(data.descripcion ?? '');
      setImagen(data.foto ? process.env.EXPO_PUBLIC_URL_SERVIDOR + '/foto/download/' + data.foto : productoDefault);
    };
    cargarArticulo();
  }, [id_Articulo]);

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

  // Función para agregar un nuevo tag
  const agregarTag = (nuevoTag: string) => {
    setTags([...tags, nuevoTag]);
    setTag('');
    setShowTags(false);
  };

  // Función para eliminar un tag
  const eliminarTag = (index: number) => {
    const nuevosTags = tags.filter((_, i) => i !== index);
    setTags(nuevosTags);
  };

  // Función para subir la imagen al servidor
  const subirImagen = async (uri: string | null) => {
    if (!uri) return productoDefault;
    try {
      const filename = uri.split('/').pop() || 'imagen.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1].toLowerCase() : 'jpg';
      const type = `image/${ext}`;

      const formData = new FormData();
      formData.append('archivo', {
        uri,
        name: filename,
        type,
      } as any);
      console.log('Enviando imagen:', { uri, filename, type });

      const uploadResponse = await  fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + '/foto/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();
      if (uploadResponse.ok && result.rutaArchivo) {
        // Devuelve solo el nombre del archivo
        return result.rutaArchivo.split(/[\\/]/).pop();
      } else {
        return productoDefault;
      }
    } catch (error) {
      return productoDefault;
    }
  };

  // Función para actualizar el artículo
 const actualizarArticulo = async () => {
  setIsLoading(true);
  let nombreArchivoImagen = productoDefault;
  
  if (imagen) {
    if (imagen.includes(process.env.EXPO_PUBLIC_URL_SERVIDOR ?? '')) {
      // Si la imagen ya está en el servidor, extrae el nombre
      nombreArchivoImagen = imagen.split('/').pop() ?? 'producto.png';
    } else {
      // Si es una imagen nueva, súbela
      nombreArchivoImagen = await subirImagen(imagen);
    }
  }

  const updatedProducto = {
    nombre_producto: nombre,
    codigo_barras: codigoBarras,
    descripcion: descripcion,
    cantidad_stock: cantidad,
    precio: Number(precio),
    tags: tags.join(','),
    foto: nombreArchivoImagen,
    preciocompra: Number(preciocompra),
  };

  try {
    const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + '/productos/' + id_Articulo, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProducto),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el producto');
    }

    router.push('/stock');
  } catch (error) {
    console.error("Error al actualizar el artículo:", error);
    alert("Ocurrió un error al actualizar el artículo");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <ScrollView style={styles.container_articulo}>
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
          <Pressable onLongPress={() => eliminarTag(index)}>
            <Text style={styles.tag}>{item}</Text>
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Opción para agregar un nuevo tag */}
      {!showTags &&
        <Pressable style={styles.pressableButton} onPress={() => setShowTags(true)}>
          <Text style={styles.buttonText}>Agregar Tag</Text>
        </Pressable>
      }

      {showTags && (
        <View style={styles.loginFields}>
          <TextInput
            style={styles.input}
            placeholder="ingrese tag"
            value={tag}
            onChangeText={setTag}
          />
          <Pressable style={styles.pressableButton}
            onPress={() => agregarTag(tag)}>
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
        onChangeText={(value) => setCantidad(parseInt(value) || 0)}
      />

      {/* Precio de compra */}
      <Text style={styles.stock}>Precio de compra:</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="Ingrese el precio de compra"
        value={preciocompra.toString()}
        onChangeText={setPreciocompra}
      />

      {/* Precio de venta */}
      <Text style={styles.stock}>Precio de venta:</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="Ingrese el precio de venta"
        value={precio.toString()}
        onChangeText={setPrecio}
      />

      {/* Descripción */}
      <Text style={styles.stock}>Descripción del producto:</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Ingrese la descripción del producto"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {/* Imágen del producto */}
      <Text style={styles.stock}>Imágen del producto (Mantene para borrar):</Text>
      <Pressable onLongPress={() => setImagen(null)}>
        <Image 
          source={imagen ? { uri: imagen } : require('../../components/producto.png')} 
          style={styles.image_articulo} 
        />
      </Pressable>
      <Pressable style={styles.pressableButton} onPress={agregarImagen}>
        <Text style={styles.buttonText}>Seleccionar imagen</Text>
      </Pressable>

      <Pressable style={styles.pressableButton} onPress={actualizarArticulo}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </Pressable>

      <Pressable
        style={styles.pressableButton}
        onPress={async () => {
          const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + '/productos/' + id_Articulo, {
            method: 'DELETE',
          });
          if (response.ok) {
            router.push('/stock');
          } else {
            alert('No se pudo borrar el producto');
          }
        }}
      >
        <Text style={styles.buttonText}>Borrar artículo</Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditarArticulo;