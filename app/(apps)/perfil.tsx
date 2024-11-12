import React, { useCallback, useEffect, useState } from 'react'; 
import { View, Text, Image, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { vaciar, vaciarCarrito } from './redux/store';
import styles from './styles';
import * as ImagePicker from 'expo-image-picker';

export default function PerfilPage() {
    interface RootState {
      user: {
        email: string;
        name: string;
        id: number;
        role: string;
      };
    }
  
  const email = useSelector((state: RootState) => state.user.email);
  const nombre = useSelector((state: RootState) => state.user.name);
  const id = useSelector((state: RootState) => state.user.id);
  const role = useSelector((state: RootState) => state.user.role);
  const dispatch = useDispatch();
  const defaultUri = '../../components/perfil.png'; // URI de imagen por defecto
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {getUri()}, []);
  useFocusEffect(
    useCallback(() => {
      console.log('PerfilPage: Ejecutando getUri al volver al foco');
      getUri(); // Recargar los productos cuando la pantalla reciba el foco
    }, [])
  );
// Función para seleccionar la imagen
const agregarImagen = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    //console.log(result.assets)
    await subirImagen(result.assets[0].uri);
    getUri();
  }
};

const subirImagen = async (uri: string | null) => {
  if (!uri) return;

  try {
      // Obtén el Blob desde la URI de la imagen
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log(response.blob);

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
          console.log('Imagen subida exitosamente:', result.url);
          putFoto(result.rutaArchivo.split('\\').pop())
      } else {
          console.error('Error al subir la imagen:', result);
      }

  } catch (error) {
      console.error('Error en la solicitud POST:', error);
  }

};

async function getUri() { // obtener foto en bd
  try {
    let uri_foto = null;
    
    if (role === "Proveedor") {
      const response = await fetch("http://localhost:4000/provedores/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const usuario = await response.json();
        uri_foto = usuario.foto;
      } else {
        throw new Error('No hay respuesta del servidor al pedir foto');
      }
    } else {
      const response = await fetch("http://localhost:4000/cliente/buscar/id/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const usuario = await response.json();
        uri_foto = usuario.foto;
      } else {
        throw new Error('No hay respuesta del servidor al pedir foto');
      }
    }

    // Asigna la imagen obtenida del servidor o la imagen por defecto
    setImageUri(uri_foto ? `http://localhost:4000/foto/download/${uri_foto}` : defaultUri);
    
  } catch (error) {
    console.error('Error al obtener foto:', error);
    setImageUri(defaultUri); // Establece la imagen por defecto solo si hay un error
  }
}

async function putFoto(uri_foto: string) {//subir foto a bd
    console.log('Se carga: ',JSON.stringify({ foto: uri_foto }));
    console.log("uri: ",imageUri);
    try {
      if (role =="Proveedor"){

        const response = await fetch("http://localhost:4000/provedores/" + id, {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foto: uri_foto }),
      });
      if (!response.ok) {
        throw new Error('No hay respuesta del servidor de provedor al subir foto');
        }
      }
      else{
        const response = await fetch("http://localhost:4000/cliente/actualizar/" + id, {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foto: uri_foto }),
      });
      if (!response.ok) {
        throw new Error('No hay respuesta del servidor de cliente al subir foto');
        }
      }
      console.log("Se Actualizo la foto");
    } catch (error) {
      console.error('Error al subir foto:', error);
    }
    finally{
      //router.push("./perfil");
      router.dismiss()
    }
  }


  function salir() {
    // Vaciar tanto la información del usuario como el carrito
    dispatch(vaciar());
    dispatch(vaciarCarrito());
    console.log("se cerro la sesion");
    router.push('/');
  }

  return (
    <View style={styles.container}>
    <Pressable onPress={() => agregarImagen()}>
      
        <Image
          source={{ uri: imageUri }}
          style={styles.profileImage}
        />
      
    </Pressable>

      {/* Información del perfil */}
      <Text style={styles.profileName}>{nombre}</Text>
      <Text style={styles.profileEmail}>email: {email}</Text>
      <Text style={styles.profileEmail}>id: {role}</Text>

      {/* Botón de cerrar sesión */}
      <Pressable style={styles.pressableButton} onPress={() => salir()}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}



