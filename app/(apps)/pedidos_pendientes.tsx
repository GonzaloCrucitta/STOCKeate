import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';

export default function PendingOrdersPage() {
    const [newOrder, setNewOrder] = useState('');
    const [orders, setOrders] = useState<{ id: number, text: string, completed: boolean }[]>([]);

    const addOrder = () => {
        if (newOrder.trim()) {
            setOrders(prevOrders => [
                ...prevOrders,
                { id: Date.now(), text: newOrder, completed: false }
            ]);
            setNewOrder('');
        }
    };

    const toggleOrderCompletion = (id: number) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === id ? { ...order, completed: !order.completed } : order
            )
        );
    };

    const deleteOrder = (id: number) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    };

    return (
        <KeyboardAvoidingView
            style={styles.container_pedidos_pendientes}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.title}>Pedidos Pendientes</Text>

                {/* Sección para agregar pedido */}
                <TextInput
                    style={styles.input_pedidos_pendientes}
                    placeholder="Agregar nuevo pedido"
                    value={newOrder}
                    onChangeText={setNewOrder}
                />
                <Pressable style={styles.button_agregar_pedido} onPress={addOrder}>
                    <Text style={styles.buttonText}>Agregar Pedido</Text>
                </Pressable>

                {/* Lista de pedidos pendientes */}
                <View style={styles.pendingOrdersSection}>
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.orderItem_pedidos_pendientes}>
                                <Text
                                    style={[
                                        styles.orderText,
                                        item.completed ? styles.completedText : null
                                    ]}
                                >
                                    {item.text}
                                </Text>
                                <View style={styles.orderActions}>
                                    <Pressable onPress={() => toggleOrderCompletion(item.id)}>
                                        <Text style={styles.completeButton}>
                                            {item.completed ? 'Reabrir' : 'Completar'}
                                        </Text>
                                    </Pressable>
                                    <Pressable onPress={() => deleteOrder(item.id)}>
                                        <Text style={styles.deleteButton}>Eliminar</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/* Botón "Volver" con mayor separación */}
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
