import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';

interface RootState {
  user: {
    email: string;
    name: string;
    id: number;
  };
}

const OrderStatus = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aceptado":
        return "green";
      case "rechazado":
        return "red";
      default:
        return "orange"; // Color para "pendiente" o cualquier otro estado no reconocido
    }
  };

  return (
    <View style={styles.orderStatusContainer}>
      <Text style={[styles.stageText, { color: getStatusColor(status) }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

const OrderPage = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el ID del cliente desde el store
  const idCliente = useSelector((state: RootState) => state.user.id);

  const fetchPedidos = async () => {
    setLoading(true); // Muestra el indicador de carga mientras se actualizan los pedidos
    try {
      const response = await fetch(`http://localhost:4000/crearpedidos/estado-pedido-cliente/${idCliente}`);
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }
      const data = await response.json();
      setPedidos(data);
      setError(null); // Limpia el error en caso de éxito
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false); // Oculta el indicador de carga al finalizar
    }
  };

  useEffect(() => {
    fetchPedidos(); // Llama a fetchPedidos al cargar la pantalla
  }, [idCliente]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de Pedidos</Text>
      
      {/* Botón para actualizar manualmente */}
      <Button title="Actualizar pedidos" onPress={fetchPedidos} color="#007bff" />

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id_pedido.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.productText}>Producto: {item.detalles?.[0]?.producto?.nombre_producto || 'Desconocido'}</Text>
            <Text style={styles.productText}>Cantidad Pedida: {item.detalles?.[0]?.cantidad || '0'}</Text>
            <Text style={styles.productText}>Fecha de Pedido: {new Date(item.fecha_pedido).toLocaleDateString()}</Text>
            <OrderStatus status={item.detalles?.[0]?.estado_proveedor || 'pendiente'} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  productText: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderStatusContainer: {
    marginTop: 10,
  },
  stageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
    marginTop: 20,
  },
});

export default OrderPage;
