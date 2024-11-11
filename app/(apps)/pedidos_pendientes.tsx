import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import styles from './styles';
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
                            keyExtractor={(item) => item.id_detalle_pedido ? item.id_detalle_pedido.toString() : '0'}
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
