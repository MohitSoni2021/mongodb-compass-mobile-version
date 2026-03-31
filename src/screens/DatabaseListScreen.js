import React, { useEffect, useState } from 'react';
import { FlatList, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchDatabases } from '../services/api';
import { Database, ChevronRight, HardDrive, RefreshCw, Server, ArrowLeft, Settings } from 'lucide-react-native';

// Gluestack UI
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export default function DatabaseListScreen() {
    const navigation = useNavigation();
    const { activeUri } = useConnectionStore();
    
    const [databases, setDatabases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDatabases(); }, [activeUri]);

    const loadDatabases = async () => {
        if (!activeUri) return;
        setLoading(true);
        try {
            const data = await fetchDatabases(activeUri);
            setDatabases(data.databases || []);
        } catch (error) {
            Alert.alert('Analysis Failed', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => navigation.navigate('Collections', { dbName: item.name })}
            activeOpacity={0.8}
        >
            <Card className="bg-white p-5 rounded-[2.2rem] mb-4 border border-slate-50 shadow-sm">
                <HStack className="items-center justify-between">
                    <HStack className="items-center flex-1" space="md">
                        <Box className="bg-[#EFF6FF] p-4 rounded-[1.5rem]">
                            <Database size={24} color="#2563eb" />
                        </Box>
                        <VStack className="flex-1">
                            <Text className="text-[#1e293b] text-lg font-black font-['InclusiveSans'] tracking-tight mb-0.5">{item.name}</Text>
                            <HStack className="items-center" space="xs">
                                <HardDrive size={12} color="#94A3B8" />
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-['InclusiveSans']">
                                    {formatSize(item.sizeOnDisk)}
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                    <Box className="bg-slate-50 p-2 rounded-full border border-slate-100">
                        <ChevronRight size={16} color="#1e293b" />
                    </Box>
                </HStack>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#FAF9F6]">
            {/* Custom Premium Header */}
            <VStack className="px-7 pt-10 pb-6" space="lg">
                <HStack className="justify-between items-center">
                    <HStack space="md" className="items-center">
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-50"
                        >
                            <ArrowLeft size={20} color="#1e293b" />
                        </TouchableOpacity>
                        <VStack>
                            <Text className="text-[#1e293b] text-2xl font-black font-['InclusiveSans'] tracking-tighter">Database Hub</Text>
                            <Text className="text-[#64748b] text-[11px] font-bold uppercase tracking-widest font-['InclusiveSans'] mt-1">Found Instances</Text>
                        </VStack>
                    </HStack>
                    <TouchableOpacity 
                        onPress={loadDatabases}
                        className="bg-white p-3 rounded-xl shadow-sm border border-slate-50"
                    >
                        <RefreshCw size={20} color="#1e293b" />
                    </TouchableOpacity>
                </HStack>
            </VStack>

            {loading ? (
                <VStack className="flex-1 justify-center items-center" space="md">
                    <Spinner size="large" color="#1e293b" />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans'] mt-4">Connecting Cluster...</Text>
                </VStack>
            ) : (
                <FlatList
                    data={databases}
                    keyExtractor={(item) => item.name}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <VStack className="items-center mt-20" space="md">
                            <Box className="bg-white p-6 rounded-full border border-dashed border-slate-200">
                                <Database size={48} color="#cbd5e1" />
                            </Box>
                            <Text className="text-slate-400 text-sm font-medium font-['InclusiveSans'] text-center">
                                No databases discovered.
                            </Text>
                        </VStack>
                    }
                />
            )}
        </SafeAreaView>
    );
}
