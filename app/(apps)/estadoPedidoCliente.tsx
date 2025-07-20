import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ScrollView, Image, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';

interface RootState {
  user: {
    email: string;
    name: string;
    id: number;
  };
}

interface DetallePedido {
  id_detalle_pedido: number;
  cantidad: number;
  precio_unitario: number;
  estado_proveedor: string;
  producto: {
    nombre_producto: string;
  };
}

interface Pedido {
  id_pedido: number;
  fecha_pedido: string;
  detalles: DetallePedido[];
}

const OrderStatus = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aceptado":
        return "green";
      case "rechazado":
        return "red";
      default:
        return "orange";
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

const OrderItem = ({ pedido }: { pedido: Pedido }) => {
  return (
    <View style={styles.orderItem}>
      <Text style={styles.orderDate}>Pedido # {pedido.id_pedido}</Text>
      <Text style={styles.orderDate}>Fecha: {new Date(pedido.fecha_pedido).toLocaleDateString()}</Text>
      
      {pedido.detalles.map((detalle, index) => (
        <View key={detalle.id_detalle_pedido} style={styles.productItem}>
          <Text style={styles.productText}>• {detalle.producto.nombre_producto}</Text>
          <Text style={styles.productText}>  Cantidad: {detalle.cantidad}</Text>
          <OrderStatus status={detalle.estado_proveedor} />
        </View>
      ))}
    </View>
  );
};

const OrderPage = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const idCliente = useSelector((state: RootState) => state.user.id);
  const emptyBoxImage = require('../../components/empty-box.png');

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR + `/crearpedidos/estado-pedido-cliente/${idCliente}`);
      if (!response.ok) {
        if (response.status !== 404) {
          throw new Error('Error al obtener los pedidos');
        }
        setPedidos([]);
        return;
      }
      const data = await response.json();
      setPedidos(data || []);
      setError(null);
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('404'))) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } else {
        setPedidos([]);
      }
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPedidos();
  }, []);

  useEffect(() => {
    fetchPedidos();
  }, [idCliente]);

  if (loading && pedidos.length === 0) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de Pedidos</Text>
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']}
            tintColor="#0000ff"
          />
        }
      >
        {pedidos.length === 0 ? (
          <View style={styles.emptyState}>
            <Image 
              source={emptyBoxImage}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>📭 No tienes pedidos pendientes</Text>
          </View>
        ) : (
          <FlatList
            data={pedidos}
            keyExtractor={(item) => item.id_pedido.toString()}
            renderItem={({ item }) => <OrderItem pedido={item} />}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </ScrollView>
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
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productItem: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
  },
  productText: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderStatusContainer: {
    marginTop: 5,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default OrderPage;