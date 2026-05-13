import * as SecureStore from 'expo-secure-store';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import {useState, useEffect} from 'react';

export default function Home() {
    
    const [token, setToken] = useState('Buscando token...');

    useEffect(() => {
        const obtenerToken = async () => {
            try {
                const tokenGuardado = await SecureStore.getItemAsync('jwt');
                
                if (tokenGuardado) {
                    setToken(tokenGuardado);
                } else {
                    setToken("No se encontró ningún token");
                }
            } catch (error) {
                setToken("Error");
            }
        };

        obtenerToken();
    }, []);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView>
                <Text>{token}</Text>
            </SafeAreaView>
        </>
    );
}