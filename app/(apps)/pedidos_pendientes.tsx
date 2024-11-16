import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { useRouter } from 'expo-router';

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

    // Obtener ID del proveedor desde el store
    const providerId = useSelector((state: RootState) => state.user.id);

    // Definir fetchPendingOrders para poder reutilizarla
    const fetchPendingOrders = useCallback(async () => {
        const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
        setLoading(true);
        await sleep(1300);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL_SERVIDOR}/crearpedidos/pedidos-pendientes/${providerId}`);
            
            if (!response.ok) {
                throw new Error('Error en la solicitud de pedidos pendientes');
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching pending orders:", error);
        } finally {
            setLoading(false);  // Ocultar el indicador de carga una vez que se obtienen los pedidos
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

            // Actualizar el estado del pedido localmente si se acepta o rechaza correctamente
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id_detalle_pedido === idDetallePedido 
                    ? { ...order, estado_proveedor: newStatus }
                    : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
            alert(error.message); // Mostrar el mensaje de error si ocurre un problema
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

                {/* Botón "Volver a obtener pedidos" */}
                <Pressable
                    style={styles.reloadButton}
                    onPress={fetchPendingOrders}
                >
                    <Text style={styles.buttonText}>Actualizar Pedidos</Text>
                </Pressable>

            </ScrollView>
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
    reloadButton: {
        marginTop: 20,
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
