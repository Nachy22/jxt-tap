import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initNfc } from './src/services/NfcService';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import PaymentSuccessScreen from './src/screens/PaymentSuccessScreen';
import PaymentFailedScreen from './src/screens/PaymentFailedScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';
import OfflineScreen from './src/screens/OfflineScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initNfc();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
        <Stack.Screen name="PaymentFailed" component={PaymentFailedScreen} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
        <Stack.Screen name="Offline" component={OfflineScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}