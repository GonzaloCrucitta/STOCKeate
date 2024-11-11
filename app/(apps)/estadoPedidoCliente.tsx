import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const OrderStatus = ({ status }: { status: string }) => {
  const stages = ["Pedido Pendiente", "Rechazado"];

  return (
    <View style={styles.orderStatusContainerPedidoCliente}>
      {stages.map((stage, index) => (
        <View key={index} style={styles.stageContainerPedidoCliente}>
          <Text
            style={[
              styles.stageTextPedidoCliente,
              { color: index <= stages.indexOf(status) ? 'green' : 'gray' }
            ]}
          >
            {stage}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default OrderStatus;
