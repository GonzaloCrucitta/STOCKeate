import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

interface RootState {
  user: {
    email: string;
    name: string;
    id: number;
  };
}

const OrderStatus = ({ status }: { status: string }) => {
  const stages = ["Pedido Pendiente", "Rechazado", "Aceptado"];

  return (
    <View style={styles.orderStatusContainer}>
      {stages.map((stage, index) => (
        <View key={index} style={styles.stageContainer}>
          <Text
            style={[
              styles.stageText,
              { color: index <= stages.indexOf(status) ? 'green' : 'gray' }
            ]}
          >
            {stage}
          </Text>
        </View>
      ))}
    </View>
  );
};

const OrderPage = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el ID del cliente desde el store
  const idCliente = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch(`http://localhost:4000/crearpedidos/estado-pedido-cliente/${idCliente}`);
        if (!response.ok) {
          throw new Error('Error al obtener los pedidos');
        }
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

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
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id_pedido.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.productText}>Producto: {item.detalles?.[0]?.producto?.nombre_producto || 'Desconocido'}</Text>
            <Text style={styles.productText}>Cantidad Pedida: {item.detalles?.[0]?.cantidad || '0'}</Text>
            <Text style={styles.productText}>Fecha de Pedido: {new Date(item.fecha_pedido).toLocaleDateString()}</Text>
            <OrderStatus status={item.detalles?.[0]?.estado_proveedor || 'Pedido Pendiente'} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageContainer: {
    padding: 5,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
  },
  stageText: {
    fontSize: 14,
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
