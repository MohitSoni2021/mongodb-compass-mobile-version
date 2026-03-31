import React, { useEffect, useState } from 'react';
import { FlatList, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchCollections } from '../services/api';
import { Layers, ChevronRight, Search, LayoutGrid } from 'lucide-react-native';

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
        <TouchableOpacity 
            onPress={() => navigation.navigate('Documents', { dbName, collectionName: item.name })}
            activeOpacity={0.7}
        >
            <Card className="bg-white p-5 rounded-[2rem] mb-4 border border-[#E0F2F1] shadow-sm">
                <HStack className="items-center justify-between">
                    <HStack className="items-center flex-1" space="md">
                        <Box className="bg-[#F1F8E9] p-3.5 rounded-2xl">
                            <Layers size={24} color="#558B2F" />
                        </Box>
                        <VStack className="flex-1">
                            <Text className="text-[#004D40] text-lg font-bold font-['InclusiveSans'] tracking-tight mb-0.5">{item.name}</Text>
                            <HStack className="items-center" space="xs">
                                <LayoutGrid size={12} color="#94A3B8" />
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-['InclusiveSans']">
                                    TYPE: {item.type.toUpperCase()}
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                    <Box className="bg-[#00796B] p-1.5 rounded-full">
                        <ChevronRight size={14} color="white" />
                    </Box>
                </HStack>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F8FBFA]">
            <VStack className="p-6 pt-10" space="lg">
                <VStack space="xs">
                    <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans']">Target Namespace</Text>
                    <Text className="text-[#004D40] font-black text-3xl font-['InclusiveSans'] tracking-tighter" numberOfLines={1}>{dbName}</Text>
                </VStack>
                <Divider className="bg-[#E0F2F1]" />
            </VStack>

            {loading ? (
                <VStack className="flex-1 justify-center items-center" space="md">
                    <Spinner size="large" color="#00796B" />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans'] mt-2">Indexing Collections...</Text>
                </VStack>
            ) : (
                <FlatList
                    data={collections}
                    keyExtractor={(item) => item.name}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                    ListEmptyComponent={
                        <VStack className="items-center mt-20" space="md">
                            <Layers size={48} color="#CBD5E1" />
                            <Text className="text-slate-400 text-sm font-medium font-['InclusiveSans']">This database has no collections.</Text>
                        </VStack>
                    }
                />
            )}
        </SafeAreaView>
    );
}
