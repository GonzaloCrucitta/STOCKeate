import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Pressable, StyleSheet, Button, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';

interface RootState {
    user: {
        email: string;
        name: string;
        id: number;
    };
}

export default function ProductSummaryPage() {
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [totals, setTotals] = useState({
        totalVentas: 0,
        totalCostos: 0,
        totalGanancia: 0,
        totalCantidadVendida: 0,
    });

    // Obtener ID del proveedor desde el store
    const providerId = useSelector((state: RootState) => state.user.id);

    const fetchProductosResumen = async () => {
        setLoading(true);
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_URL_SERVIDOR+`/resumen/ingresos-y-gastos/${providerId}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener el resumen de productos');
            }

            const data = await response.json();
            setProductos(data);

            // Calcular totales (ventas, costos, ganancia)
            const totals = data.reduce((acc: any, producto: any) => {
                const ganancia = producto.ingresos - producto.costos;

                acc.totalCantidadVendida += producto.cantidadVendida;
                acc.totalVentas += producto.ingresos;
                acc.totalCostos += producto.costos;
                acc.totalGanancia += ganancia;
                return acc;
            }, {
                totalVentas: 0,
                totalCostos: 0,
                totalGanancia: 0,
                totalCantidadVendida: 0,
            });
            setTotals(totals);
        } catch (error) {
            console.error("Error fetching product summary:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Función para el pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProductosResumen();
    }, []);

    useEffect(() => {
        fetchProductosResumen(); // Llama a la función al cargar la pantalla
    }, [providerId]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Text style={styles.title}>Resumen de Productos - Proveedor</Text>

            {loading && productos.length === 0 ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={productos}
                    keyExtractor={(item) => item.producto}
                    renderItem={({ item }) => (
                        <View style={styles.productItem}>
                            <Text style={styles.productText}>Producto: {item.producto}</Text>
                            <Text style={styles.productText}>Cantidad Vendida: {item.cantidadVendida}</Text>
                            <Text style={styles.productText}>Ingresos: ${item.ingresos.toFixed(2)}</Text>
                            <Text style={styles.productText}>Costos: ${item.costos.toFixed(2)}</Text>
                            <Text style={styles.productText}>Ganancia/Pérdida: ${(item.ingresos - item.costos).toFixed(2)}</Text>
                        </View>
                    )}
                    ListFooterComponent={
                        <View style={styles.totalSection}>
                            <Text style={styles.totalText}>Total Ventas: ${totals.totalVentas.toFixed(2)}</Text>
                            <Text style={styles.totalText}>Total Costos: ${totals.totalCostos.toFixed(2)}</Text>
                            <Text style={styles.totalText}>Total Ganancia/Pérdida: ${totals.totalGanancia.toFixed(2)}</Text>
                            <Text style={styles.totalText}>Total Cantidad Vendida: {totals.totalCantidadVendida}</Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#0000ff']} // Color del indicador (Android)
                            tintColor="#0000ff" // Color del indicador (iOS)
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </KeyboardAvoidingView>
    );
}

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
    productItem: {
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
    totalSection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#e9ecef',
        borderRadius: 8,
    },
    totalText: {
        fontSize: 18,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
