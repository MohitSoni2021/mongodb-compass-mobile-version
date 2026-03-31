import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ConnectScreen from '../screens/ConnectScreen';
import DatabaseListScreen from '../screens/DatabaseListScreen';
import CollectionListScreen from '../screens/CollectionListScreen';
import DocumentListScreen from '../screens/DocumentListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator 
        initialRouteName="Connect"
        screenOptions={{
          headerStyle: { backgroundColor: '#FAF9F6' },
          headerTintColor: '#1e293b',
          headerTitleStyle: { 
            fontWeight: '900', 
            fontSize: 16,
            color: '#1e293b',
            fontFamily: 'MontserratBlack'
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Connect" component={ConnectScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Databases" component={DatabaseListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Collections" component={CollectionListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Documents" component={DocumentListScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}
