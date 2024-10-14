import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import styles from './styles';
import { router } from 'expo-router';

export default function ProvidersMainApp() {

    const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>({
        stock: true,
        movements: false,
        newEntry: false,
        newExit: false,
        reports: false,
        pendingOrders: false,
    });

    const toggleModal = (section: string) => {
        setModalVisible((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.pressableButton} onPress={() => router.push('../stock')}>
                <Text style={styles.buttonText}>Stock</Text>
            </Pressable>
            <Pressable style={styles.pressableButton} onPress={() => toggleModal('movements')}>
                <Text style={styles.buttonText}>Movimientos</Text>
            </Pressable>
            <Pressable style={styles.pressableButton} onPress={() => router.push('../entrante')}>
                <Text style={styles.buttonText}>Re Stock</Text>
            </Pressable>
            <Pressable style={styles.pressableButton} onPress={() => router.push('../saliente')}>
                <Text style={styles.buttonText}>Venta</Text>
            </Pressable>
            <Pressable style={styles.pressableButton} onPress={() => router.push('../pedidos_pendientes')}>
                <Text style={styles.buttonText}>Pedidos Pendientes</Text>
            </Pressable>
        </View>
    );
}
