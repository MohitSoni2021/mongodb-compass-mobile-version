import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

// Font Loading
import { useFonts } from 'expo-font';
import {
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black
} from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        Montserrat: Montserrat_400Regular,
        MontserratBold: Montserrat_700Bold,
        MontserratBlack: Montserrat_900Black,
    });

    React.useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <GluestackUIProvider mode="light">
                <View style={styles.container}>
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                    <StatusBar style="dark" />
                </View>
            </GluestackUIProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', 
    },
});
