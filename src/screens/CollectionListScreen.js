import React, { useEffect, useState } from 'react';
import { FlatList, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchCollections } from '../services/api';
import { Layers, ChevronRight, Search, LayoutGrid, Cpu, ArrowLeft, RefreshCw } from 'lucide-react-native';

// Gluestack UI
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

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
            setCollections(data.collections || []);
        } catch (error) {
            Alert.alert('Analysis Failed', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => navigation.navigate('Documents', { dbName, collectionName: item.name })}
            activeOpacity={0.8}
        >
            <Card className="bg-white p-5 rounded-[2.2rem] mb-4 border border-slate-50 shadow-sm">
                <HStack className="items-center justify-between">
                    <HStack className="items-center flex-1" space="md">
                        <Box className="bg-[#FDF2F8] p-4 rounded-[1.5rem]">
                            <Layers size={24} color="#db2777" />
                        </Box>
                        <VStack className="flex-1">
                            <Text className="text-[#1e293b] text-lg font-black font-['InclusiveSans'] tracking-tight mb-0.5">{item.name}</Text>
                            <HStack className="items-center" space="xs">
                                <Cpu size={12} color="#94A3B8" />
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-['InclusiveSans']">
                                    TYPE: {item.type.toUpperCase()}
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
                    <HStack space="md" className="items-center flex-1">
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-50"
                        >
                            <ArrowLeft size={20} color="#1e293b" />
                        </TouchableOpacity>
                        <VStack className="flex-1">
                            <Text className="text-[#1e293b] text-2xl font-black font-['InclusiveSans'] tracking-tighter" numberOfLines={1}>{dbName}</Text>
                            <Text className="text-[#64748b] text-[11px] font-bold uppercase tracking-widest font-['InclusiveSans'] mt-1">Found Collections</Text>
                        </VStack>
                    </HStack>
                    <TouchableOpacity 
                        onPress={loadCollections}
                        className="bg-white p-3 rounded-xl shadow-sm border border-slate-50 ml-2"
                    >
                        <RefreshCw size={20} color="#1e293b" />
                    </TouchableOpacity>
                </HStack>
            </VStack>

            {loading ? (
                <VStack className="flex-1 justify-center items-center" space="md">
                    <Spinner size="large" color="#1e293b" />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans'] mt-4">Indexing Context...</Text>
                </VStack>
            ) : (
                <FlatList
                    data={collections}
                    keyExtractor={(item) => item.name}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <VStack className="items-center mt-20" space="md">
                            <Box className="bg-white p-6 rounded-full border border-dashed border-slate-200">
                                <Layers size={48} color="#cbd5e1" />
                            </Box>
                            <Text className="text-slate-400 text-sm font-medium font-['InclusiveSans'] text-center">
                                No collections discovered.
                            </Text>
                        </VStack>
                    }
                />
            )}
        </SafeAreaView>
    );
}
