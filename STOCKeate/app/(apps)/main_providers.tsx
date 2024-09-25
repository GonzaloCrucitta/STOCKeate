import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressableButton: {
        backgroundColor: "#2196F3",
        padding: 15,
        borderRadius: 5,
        paddingHorizontal: 40,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalText: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        fontSize: 18,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#f44336',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
