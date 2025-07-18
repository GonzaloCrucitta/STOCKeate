import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';

interface RootState {
    user: {
        email: string;
        name: string;
        id: number;
    };
}

export default function PendingOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const providerId = useSelector((state: RootState) => state.user.id);

    const fetchPendingOrders = useCallback(async () => {
        const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
        setLoading(true);
        await sleep(1300);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL_SERVIDOR}/crearpedidos/pedidos-pendientes/${providerId}`);
            if (!response.ok) throw new Error('Error en la solicitud de pedidos pendientes');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching pending orders:", error);
        } finally {
            setLoading(false);
        }
    }, [providerId]);

    useEffect(() => {
        fetchPendingOrders();
    }, [fetchPendingOrders]);

    const handleChangeOrderStatus = async (idDetallePedido: number, newStatus: string) => {
        try {
            const url = newStatus === 'aceptado'
                ? `${process.env.EXPO_PUBLIC_URL_SERVIDOR}/crearpedidos/aceptar/${idDetallePedido}`
                : `${process.env.EXPO_PUBLIC_URL_SERVIDOR}/crearpedidos/actualizar-estado-detalle/${idDetallePedido}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado_proveedor: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar el estado del pedido');
            }

            fetchPendingOrders(); // 🔄 Refresca la lista
        } catch (error) {
            console.error("Error updating order status:", error);
            alert(error.message);
        }
    };

    const renderOrderItem = ({ item }: { item: any }) => {
        const onSwipeLeft = () => {
            if (item.estado_proveedor === 'pendiente') {
                handleChangeOrderStatus(item.id_detalle_pedido, 'rechazado');
            }
        };

        const onSwipeRight = () => {
            if (item.estado_proveedor === 'pendiente') {
                handleChangeOrderStatus(item.id_detalle_pedido, 'aceptado');
            }
        };

        return (
            <Swipeable
                renderLeftActions={() => <View style={styles.swipeLeftIndicator} />}
                renderRightActions={() => <View style={styles.swipeRightIndicator} />}
                onSwipeableOpen={(direction) => {
                    if (direction === 'left') {
                        onSwipeLeft();
                    } else if (direction === 'right') {
                        onSwipeRight();
                    }
                }}
            >
                <View style={styles.orderItem_pedidos_pendientes}>
                    <Text style={styles.orderText}>Producto: {item.producto.nombre_producto}</Text>
                    <Text style={styles.orderText}>Cantidad: {item.cantidad}</Text>
                    <Text style={styles.orderText}>Fecha del Pedido: {new Date(item.pedido.fecha_pedido).toLocaleDateString()}</Text>
                    <Text style={styles.orderText}>Estado: {item.estado_proveedor}</Text>
                </View>
            </Swipeable>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container_pedidos_pendientes}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Text style={styles.title}>Pedidos Pendientes</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    contentContainerStyle={styles.pendingOrdersSection}
                    data={orders}
                    keyExtractor={(item) => item.id_detalle_pedido.toString()}
                    renderItem={renderOrderItem}
                    refreshing={loading}
                    onRefresh={fetchPendingOrders}
                />
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container_pedidos_pendientes: {
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
    pendingOrdersSection: {
        marginBottom: 20,
    },
    orderItem_pedidos_pendientes: {
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
    orderText: {
        fontSize: 16,
        marginBottom: 5,
    },
    swipeLeftIndicator: {
        backgroundColor: 'red',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    swipeRightIndicator: {
        backgroundColor: 'green',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },  
    swipeText: {
        color: 'white',
        fontWeight: 'bold',
    },  
});     