import React, { useEffect, useState } from 'react';
import { FlatList, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchDatabases } from '../services/api';
import { Database, ChevronRight, HardDrive, RefreshCw } from 'lucide-react-native';

// Gluestack UI
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';

export default function DatabaseListScreen() {
    const navigation = useNavigation();
    const { activeUri } = useConnectionStore();
    
    const [databases, setDatabases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDatabases();
    }, [activeUri]);

    const loadDatabases = async () => {
        if (!activeUri) return;
        setLoading(true);
        try {
            const data = await fetchDatabases(activeUri);
            setDatabases(data.databases);
        } catch (error) {
            Alert.alert('Error', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const renderItem = ({ item }) => (
        <Card 
            className="bg-slate-900/40 p-4 rounded-3xl mb-4 border border-slate-700/40 shadow-sm active:bg-slate-800/60 overflow-hidden"
            onPress={() => navigation.navigate('Collections', { dbName: item.name })}
        >
            <HStack className="items-center justify-between">
                <HStack className="items-center flex-1">
                    <Box className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 mr-4">
                        <Database size={24} color="#10b981" />
                    </Box>
                    <VStack className="flex-1">
                        <Text className="text-white text-lg font-black tracking-tight mb-0.5">{item.name}</Text>
                        <HStack className="items-center" space="xs">
                            <HardDrive size={12} color="#94a3b8" />
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                {formatSize(item.sizeOnDisk)}
                            </Text>
                        </HStack>
                    </VStack>
                </HStack>
                <ChevronRight size={20} color="#64748b" />
            </HStack>
        </Card>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <VStack className="p-5 pb-2" space="xs">
                <HStack className="justify-between items-end">
                    <VStack>
                        <Text className="text-white font-black text-3xl">Explorer</Text>
                        <Text className="text-slate-400 text-sm font-medium">Remote MongoDB Instance</Text>
                    </VStack>
                    <Button variant="link" className="p-0" onPress={loadDatabases}>
                        <ButtonIcon as={RefreshCw} color="#10b981" />
                    </Button>
                </HStack>
                <Divider className="mt-4 bg-slate-800/50" />
            </VStack>

            {loading ? (
                <VStack className="flex-1 justify-center items-center" space="md">
                    <Spinner size="large" color="#10b981" />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Nodes</Text>
                </VStack>
            ) : (
                <FlatList
                    data={databases}
                    keyExtractor={(item) => item.name}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20 }}
                    ListHeaderComponent={
                        <Text className="text-slate-500 font-bold mb-4 ml-1 uppercase tracking-widest text-[10px]">Data Storage Containers</Text>
                    }
                    ListEmptyComponent={
                        <VStack className="items-center mt-20" space="md">
                            <Database size={40} color="#334155" />
                            <Text className="text-slate-500 text-sm text-center">No databases found on this cluster.</Text>
                        </VStack>
                    }
                />
            )}
        </SafeAreaView>
    );
}
