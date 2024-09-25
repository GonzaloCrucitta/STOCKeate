import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import styles from './styles';

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
            <Pressable style={styles.pressableButton} onPress={() => toggleModal('stock')}>
                <Text style={styles.buttonText}>Stock</Text>
            </Pressable>
            <Pressable style={styles.pressableButton} onPress={() => toggleModal('movements')}>
                <Text style={styles.buttonText}>Movimientos</Text>
            </Pressable>
            <Pressable style={styles.pressableButton} onPress={() => toggleModal('newEntry')}>
                <Text style={styles.buttonText}>Nuevo Entrante</Text>
            </Pressable>
            <Pressable style={styles.pressableButton} onPress={() => toggleModal('newExit')}>
                <Text style={styles.buttonText}>Nuevo Saliente</Text>
            </Pressable>
            <Pressable style={styles.pressableButton} onPress={() => toggleModal('pendingOrders')}>
                <Text style={styles.buttonText}>Pedidos Pendientes</Text>
            </Pressable>
        </View>
    );
}