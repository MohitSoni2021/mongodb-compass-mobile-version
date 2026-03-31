import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

// Font Loading
import { 
    useFonts, 
    InclusiveSans_400Regular 
} from '@expo-google-fonts/inclusive-sans';
import {
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black
} from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        InclusiveSans: InclusiveSans_400Regular,
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
        <GluestackUIProvider mode="light">
            <View style={styles.container}>
                <AppNavigator />
                <StatusBar style="dark" />
            </View>
        </GluestackUIProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', 
    },
});
