import React, { useEffect, useState } from 'react';
import { FlatList, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchDatabases } from '../services/api';
import { Database, ChevronRight, HardDrive, RefreshCw, Layers } from 'lucide-react-native';

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
            className="bg-white p-5 rounded-[2rem] mb-4 border border-[#E0F2F1] shadow-sm active:bg-slate-50 overflow-hidden"
            onPress={() => navigation.navigate('Collections', { dbName: item.name })}
        >
            <HStack className="items-center justify-between">
                <HStack className="items-center flex-1" space="md">
                    <Box className="bg-[#E0F2F1] p-3.5 rounded-2xl">
                        <Database size={24} color="#00796B" />
                    </Box>
                    <VStack className="flex-1">
                        <Text className="text-[#004D40] text-lg font-bold font-['InclusiveSans'] tracking-tight mb-0.5">{item.name}</Text>
                        <HStack className="items-center" space="xs">
                            <HardDrive size={12} color="#94A3B8" />
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-['InclusiveSans']">
                                {formatSize(item.sizeOnDisk)}
                            </Text>
                        </HStack>
                    </VStack>
                </HStack>
                <Box className="bg-[#00796B] p-1.5 rounded-full">
                    <ChevronRight size={14} color="white" />
                </Box>
            </HStack>
        </Card>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F8FBFA]">
            <VStack className="p-6 pt-10" space="lg">
                <HStack className="justify-between items-center">
                    <VStack space="xs">
                        <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans']">Active Cluster Node</Text>
                        <Text className="text-[#004D40] font-black text-3xl font-['InclusiveSans'] tracking-tighter">Cluster Explorer</Text>
                    </VStack>
                    <Button 
                        onPress={loadDatabases}
                        className="bg-[#E0F2F1] p-3 rounded-full active:bg-[#B2DFDB] h-12 w-12"
                    >
                        <ButtonIcon as={RefreshCw} color="#00796B" size="md" />
                    </Button>
                </HStack>
                <Divider className="bg-[#E0F2F1]" />
            </VStack>

            {loading ? (
                <VStack className="flex-1 justify-center items-center" space="md">
                    <Spinner size="large" color="#00796B" />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans'] mt-2">Connecting to Data Hub...</Text>
                </VStack>
            ) : (
                <FlatList
                    data={databases}
                    keyExtractor={(item) => item.name}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                    ListEmptyComponent={
                        <VStack className="items-center mt-20" space="md">
                            <Database size={48} color="#CBD5E1" />
                            <Text className="text-slate-400 text-sm font-medium font-['InclusiveSans']">No database entities detected.</Text>
                        </VStack>
                    }
                />
            )}
        </SafeAreaView>
    );
}
