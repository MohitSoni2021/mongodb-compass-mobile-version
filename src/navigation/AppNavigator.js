import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ConnectScreen from '../screens/ConnectScreen';
import DatabaseListScreen from '../screens/DatabaseListScreen';
import CollectionListScreen from '../screens/CollectionListScreen';
import DocumentListScreen from '../screens/DocumentListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Connect"
        screenOptions={{
          headerStyle: { backgroundColor: '#020617' }, // slate-950
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '900', fontSize: 20 },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Connect" component={ConnectScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Databases" component={DatabaseListScreen} options={{ title: 'Select Database' }} />
        <Stack.Screen name="Collections" component={CollectionListScreen} options={{ title: 'Collections' }} />
        <Stack.Screen name="Documents" component={DocumentListScreen} options={{ title: 'Documents' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
