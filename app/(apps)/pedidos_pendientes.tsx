import React, { useEffect, useState } from 'react'; 
import { View, Text, FlatList, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';

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

    // Obtener ID del proveedor desde el store
    const providerId = useSelector((state: RootState) => state.user.id);

    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const response = await fetch(`http://localhost:4000/crearpedidos/pedidos-pendientes/${providerId}`);
                
                if (!response.ok) {
                    throw new Error('Error en la solicitud de pedidos pendientes');
                }

                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching pending orders:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPendingOrders();
    }, [providerId]);

    const handleChangeOrderStatus = async (idDetallePedido: number, newStatus: string) => {
        try {
            const response = await fetch(`http://localhost:4000/crearpedidos/actualizar-estado-detalle/${idDetallePedido}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado_proveedor: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado del pedido');
            }

            const updatedOrder = await response.json();
            // Actualizar el estado del pedido localmente
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id_detalle_pedido === idDetallePedido 
                    ? { ...order, estado_proveedor: newStatus }
                    : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container_pedidos_pendientes}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.title}>Pedidos Pendientes</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={styles.pendingOrdersSection}>
                        <FlatList
                            data={orders}
                            keyExtractor={(item) => item.id_detalle_pedido.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.orderItem_pedidos_pendientes}>
                                    <Text style={styles.orderText}>
                                        Producto: {item.producto.nombre_producto}
                                    </Text>
                                    <Text style={styles.orderText}>
                                        Cantidad: {item.cantidad}
                                    </Text>
                                    <Text style={styles.orderText}>
                                        Fecha del Pedido: {new Date(item.pedido.fecha_pedido).toLocaleDateString()}
                                    </Text>
                                    <Text style={styles.orderText}>
                                        Estado: {item.estado_proveedor}
                                    </Text>

                                    {/* Botones de Aceptar y Rechazar */}
                                    {item.estado_proveedor === 'pendiente' && (
                                        <View style={styles.buttonsContainer}>
                                            <Pressable
                                                style={styles.acceptButton}
                                                onPress={() => handleChangeOrderStatus(item.id_detalle_pedido, 'aceptado')}
                                            >
                                                <Text style={styles.buttonText}>Aceptar</Text>
                                            </Pressable>
                                            <Pressable
                                                style={styles.rejectButton}
                                                onPress={() => handleChangeOrderStatus(item.id_detalle_pedido, 'rechazado')}
                                            >
                                                <Text style={styles.buttonText}>Rechazar</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </View>
                            )}
                        />
                    </View>
                )}

                {/* Botón "Volver" */}
                <Pressable
                    style={styles.backButton_Pedidos_Pendientes}
                    onPress={() => router.push('../main_providers')}
                >
                    <Text style={styles.buttonText}>Volver</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Estilos adicionales para los botones
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    acceptButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    rejectButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    backButton_Pedidos_Pendientes: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
});
