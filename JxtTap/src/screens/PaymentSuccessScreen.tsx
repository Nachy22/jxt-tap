import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PaymentSuccessScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment Success Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5FF',
  },
  text: {
    fontSize: 24,
    color: '#2D3FCC',
    fontWeight: 'bold',
  },
});