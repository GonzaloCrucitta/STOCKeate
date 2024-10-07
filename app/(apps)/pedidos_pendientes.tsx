import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import styles from './styles';

export default function PendingOrdersPage() {
    const [newOrder, setNewOrder] = useState('');
    const [orders, setOrders] = useState<{ id: number, text: string, completed: boolean }[]>([]);

    const addOrder = () => {
        if (newOrder.trim()) {
            setOrders(prevOrders => [
                ...prevOrders,
                { id: Date.now(), text: newOrder, completed: false }
            ]);
            setNewOrder('');  // Limpia el campo de input
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
        <View style={styles.container}>
            <Text style={styles.title}>Pedidos Pendientes</Text>
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Agregar nuevo pedido"
                    value={newOrder}
                    onChangeText={setNewOrder}
                />
                <Pressable style={styles.pressableButton} onPress={addOrder}>
                    <Text style={styles.buttonText}>Agregar Pedido</Text>
                </Pressable>
            </View>
            
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
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
    );
}
