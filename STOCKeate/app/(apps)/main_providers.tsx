import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';

export default function ProvidersMainApp(){

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

    return(
        <View style={styles.container}>
            <Pressable style={styles.buttonContainer} onPress={() => toggleModal('stock')}>
                <Text style={styles.buttonText}>Stock</Text>
            </Pressable>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 50, 
    },
    logoImage: {
      width: 100, 
      height: 100,
      resizeMode: 'contain',
      marginBottom: 10, 
    },
    logoText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    buttonContainer: {
      alignItems: 'center',
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
    linkButton: {
      padding: 10,
    },
    linkText: {
      color: '#2196F3',
      fontSize: 16,
    },
    loginFields: {
      width: '80%',
      marginVertical: 10, 
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10, 
      width: '100%',
    },
  });