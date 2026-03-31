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
          headerStyle: { backgroundColor: '#F8FBFA' },
          headerTintColor: '#00796B',
          headerTitleStyle: { 
            fontWeight: '900', 
            fontSize: 18,
            color: '#004D40',
            fontFamily: 'InclusiveSans_400Regular'
          },
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
