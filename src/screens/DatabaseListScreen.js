import React, { useEffect, useState } from 'react';
import { FlatList, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchDatabases } from '../services/api';
import { Database, ChevronRight, HardDrive, RefreshCw, Server, ArrowLeft, Sun, Moon } from 'lucide-react-native';

// Gluestack UI
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useThemeStore } from '../store/useThemeStore';

export default function DatabaseListScreen() {
    const navigation = useNavigation();
    const { activeUri } = useConnectionStore();
    const { isDark, toggleTheme } = useThemeStore();
    
    const [databases, setDatabases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activeUri) {
            navigation.replace('Connect');
            return;
        }
        loadDatabases();
    }, [activeUri]);

    const loadDatabases = async () => {
        setLoading(true);
        try {
            const data = await fetchDatabases(activeUri);
            setDatabases(data.databases || []);
        } catch (err) {
            Alert.alert('Analysis Failed', err.error || err.message);
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

    // Theme colors
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-[#FAF9F6]';
    const cardColor = isDark ? 'bg-[#1e293b]' : 'bg-white';
    const textColor = isDark ? 'text-[#f8fafc]' : 'text-[#1e293b]';
    const mutedTextColor = isDark ? 'text-[#94a3b8]' : 'text-[#64748b]';
    const borderColor = isDark ? 'border-[#334155]' : 'border-slate-50';
    const iconSecondaryColor = isDark ? '#94a3b8' : '#1e293b';

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => navigation.navigate('Collections', { dbName: item.name })}
            activeOpacity={0.8}
        >
            <Card className={`${cardColor} p-5 rounded-[2.2rem] mb-4 border ${borderColor} shadow-sm`}>
                <HStack className="items-center justify-between">
                    <HStack className="items-center flex-1" space="md">
                        <Box className={`${isDark ? 'bg-blue-900/30' : 'bg-[#EFF6FF]'} p-4 rounded-[1.5rem]`}>
                            <Database size={24} color="#2563eb" />
                        </Box>
                        <VStack className="flex-1">
                            <Text className={`${textColor} text-lg font-black font-['InclusiveSans'] tracking-tight mb-0.5`}>{item.name}</Text>
                            <HStack className="items-center" space="xs">
                                <HardDrive size={12} color="#94A3B8" />
                                <Text className={`${mutedTextColor} text-[10px] font-bold uppercase tracking-widest font-['InclusiveSans']`}>
                                    {formatSize(item.sizeOnDisk)}
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                    <Box className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-2 rounded-full border ${isDark ? 'border-slate-600' : 'border-slate-100'}`}>
                        <ChevronRight size={16} color={iconSecondaryColor} />
                    </Box>
                </HStack>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className={`flex-1 ${bgColor}`}>
            {/* Custom Premium Header */}
            <VStack className="px-7 pt-10 pb-6" space="lg">
                <HStack className="justify-between items-center">
                    <HStack space="md" className="items-center">
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            className={`${cardColor} p-2.5 rounded-xl shadow-sm border ${borderColor}`}
                        >
                            <ArrowLeft size={20} color={iconSecondaryColor} />
                        </TouchableOpacity>
                        <VStack>
                            <Text className={`${textColor} text-2xl font-black font-['MontserratBlack'] tracking-tighter`}>Databases</Text>
                            <Text className={`${mutedTextColor} text-[11px] font-bold uppercase tracking-widest font-['MontserratBold'] mt-1`}>Cluster Overview</Text>
                        </VStack>
                    </HStack>
                    <HStack space="sm">
                        <TouchableOpacity 
                            onPress={toggleTheme}
                            className={`${cardColor} p-3 rounded-xl shadow-sm border ${borderColor}`}
                        >
                            {isDark ? (
                                <Sun size={20} color="#fbbf24" fill="#fbbf24" />
                            ) : (
                                <Moon size={20} color="#64748b" fill="#64748b" />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={loadDatabases}
                            className={`${cardColor} p-3 rounded-xl shadow-sm border ${borderColor}`}
                        >
                            <RefreshCw size={20} color={iconSecondaryColor} />
                        </TouchableOpacity>
                    </HStack>
                </HStack>
            </VStack>

            {loading ? (
                <VStack className="flex-1 justify-center items-center" space="md">
                    <Spinner size="large" color={iconSecondaryColor} />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans'] mt-4">Loading Databases...</Text>
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
                            <Box className={`${cardColor} p-6 rounded-full border border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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
