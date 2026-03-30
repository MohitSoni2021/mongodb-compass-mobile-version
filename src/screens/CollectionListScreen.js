import React, { useEffect, useState } from 'react';
import { FlatList, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchCollections } from '../services/api';
import { Layers, ChevronRight, Search } from 'lucide-react-native';

// Gluestack UI
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Divider } from '@/components/ui/divider';

export default function CollectionListScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { dbName } = route.params;
    const { activeUri } = useConnectionStore();
    
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCollections();
    }, [activeUri, dbName]);

    const loadCollections = async () => {
        if (!activeUri || !dbName) return;
        setLoading(true);
        try {
            const data = await fetchCollections(activeUri, dbName);
            setCollections(data.collections);
        } catch (error) {
            Alert.alert('Error', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <Card 
            className="bg-slate-900/40 p-4 rounded-3xl mb-4 border border-slate-700/40 active:bg-slate-800/60 transition-all uppercase"
            onPress={() => navigation.navigate('Documents', { dbName, collectionName: item.name })}
        >
            <HStack className="items-center justify-between">
                <HStack className="items-center">
                    <Box className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 mr-4">
                        <Layers size={22} color="#3b82f6" />
                    </Box>
                    <VStack>
                        <Text className="text-white text-base font-black tracking-tight">{item.name}</Text>
                        <Text className="text-slate-500 text-[10px] font-bold tracking-widest mt-0.5">
                            ENTITY TYPE: {item.type.toUpperCase()}
                        </Text>
                    </VStack>
                </HStack>
                <ChevronRight size={18} color="#475569" />
            </HStack>
        </Card>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <VStack className="p-5" space="xs">
                <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Active Data Object</Text>
                <Text className="text-white font-black text-3xl tracking-tighter">{dbName}</Text>
                <Divider className="mt-4 bg-slate-800/50" />
            </VStack>
            
            {loading ? (
                <VStack className="flex-1 justify-center items-center">
                    <Spinner size="large" color="#3b82f6" />
                </VStack>
            ) : (
                <FlatList
                    data={collections}
                    keyExtractor={(item) => item.name}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20, paddingTop: 0 }}
                    ListEmptyComponent={
                        <VStack className="items-center mt-20" space="md">
                            <Layers size={48} color="#334155" />
                            <Text className="text-slate-500 text-sm">No collections found in {dbName}.</Text>
                        </VStack>
                    }
                />
            )}
        </SafeAreaView>
    );
}
