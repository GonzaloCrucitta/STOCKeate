import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { time } from 'console';

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
    const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
    setLoading(true);
    await sleep(1300)
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+`/crearpedidos/estado-pedido-cliente/${idCliente}`);
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }
      const data = await response.json();
      setPedidos(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
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
  backButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderPage;
