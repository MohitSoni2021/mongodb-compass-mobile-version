import React, { useState } from 'react';
import { ScrollView, Alert, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { connectDb } from '../services/api';
import { 
    Database, 
    Trash2, 
    ChevronRight, 
    Server, 
    Link, 
    ShieldCheck, 
    Zap, 
    Settings, 
    LayoutGrid,
    Search,
    Plus
} from 'lucide-react-native';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText, ButtonSpinner, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';

const { width } = Dimensions.get('window');

export default function ConnectScreen() {
    const navigation = useNavigation();
    const { connections, addConnection, removeConnection, setActiveUri } = useConnectionStore();
    
    const [uri, setUri] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConnect = async (targetUri, saveName = null) => {
        if (!targetUri) {
            Alert.alert('Configuration Required', 'Please enter a MongoDB connection string.');
            return;
        }

        setLoading(true);
        try {
            await connectDb(targetUri);
            setActiveUri(targetUri);
            
            // Save logic: Check if this URI is already in our saved list
            const alreadySaved = connections.some(c => c.uri === targetUri);
            if (!alreadySaved) {
                addConnection({ 
                    uri: targetUri, 
                    name: saveName || 'Node ' + (connections.length + 1)
                });
            }
            
            navigation.navigate('Databases');
        } catch (error) {
            Alert.alert('Connection Failed', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FAF9F6]">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <VStack className="px-7 pt-12 pb-10" space="xl">
                    
                    {/* Premium Branding Header */}
                    <VStack space="md" className="mb-4">
                        <HStack className="items-center justify-between">
                            <HStack space="sm" className="items-center">
                                <Box className="bg-[#1e293b] p-2.5 rounded-2xl shadow-sm">
                                    <Database size={20} color="white" />
                                </Box>
                                <Text className="text-[#64748b] text-[11px] font-black uppercase tracking-[0.25em] font-['MontserratBold']">
                                    Compass Mobile
                                </Text>
                            </HStack>
                            <TouchableOpacity className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                                <Settings size={18} color="#64748b" />
                            </TouchableOpacity>
                        </HStack>
                        
                        <VStack className="mt-4">
                            <Text className="text-[#1e293b] text-4xl font-black leading-[1.1] font-['MontserratBlack'] tracking-tighter">
                                MongoDB {"\n"}<Text className="text-teal-600 font-['MontserratBlack']">Atlas Cluster</Text>
                            </Text>
                            <Text className="text-[#64748b] text-sm font-medium font-['Montserrat'] mt-3 leading-6">
                                Connect to your MongoDB databases locally or in the cloud with secure TLS encryption.
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Connection Configuration Hub */}
                    <Card className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-slate-900/5 border border-slate-50">
                        <VStack space="lg">
                            <HStack className="items-center justify-between">
                                <HStack space="xs" className="items-center">
                                    <Box className="bg-[#EFF6FF] p-2 rounded-full">
                                        <Plus size={14} color="#2563eb" />
                                    </Box>
                                    <Text className="text-[#1e293b] font-black text-xs uppercase tracking-widest font-['MontserratBold']">New Connection</Text>
                                </HStack>
                                <Box className="bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                                    <ShieldCheck size={14} color="#059669" />
                                </Box>
                            </HStack>

                            <VStack space="md">
                                <Box className="bg-slate-50 px-5 rounded-[1.2rem] h-14 flex-row items-center border border-slate-100">
                                    <Search size={16} color="#94a3b8" />
                                    <TextInput 
                                        className="flex-1 ml-3 text-[#1e293b] font-['InclusiveSans'] text-sm"
                                        placeholder="Connection Nickname (Optional)"
                                        placeholderTextColor="#94a3b8"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </Box>

                                <Box className="bg-slate-50 px-5 rounded-[1.2rem] h-14 flex-row items-center border border-slate-100">
                                    <Link size={16} color="#94a3b8" />
                                    <TextInput 
                                        className="flex-1 ml-3 text-[#1e293b] font-['InclusiveSans'] text-sm"
                                        placeholder="mongodb+srv://user:pass@host..."
                                        placeholderTextColor="#94a3b8"
                                        value={uri}
                                        onChangeText={setUri}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </Box>
                            </VStack>

                            <Button 
                                size="xl"
                                className="bg-[#1e293b] rounded-[1.5rem] h-16 mt-2 shadow-2xl shadow-slate-900/20"
                                onPress={() => handleConnect(uri, name)}
                                disabled={loading}
                            >
                                {loading ? <ButtonSpinner color="white" /> : (
                                    <HStack space="sm" className="items-center">
                                         <Zap size={18} color="white" fill="white" />
                                         <ButtonText className="font-extrabold text-[#FAF9F6] text-lg font-['MontserratBold']">Connect to Cluster</ButtonText>
                                    </HStack>
                                )}
                            </Button>
                        </VStack>
                    </Card>

                    {/* Saved Nodes Section */}
                    {connections.length > 0 && (
                        <VStack space="lg" className="mt-6 mb-10">
                            <HStack className="justify-between items-center px-1">
                                <Text className="text-[#64748b] font-black text-[10px] uppercase tracking-[0.2em] font-['MontserratBold']">
                                    RECENT CONNECTIONS
                                </Text>
                                <LayoutGrid size={14} color="#94a3b8" />
                            </HStack>
                            
                            {connections.map((conn) => (
                                <TouchableOpacity 
                                    key={conn.id} 
                                    onPress={() => handleConnect(conn.uri, conn.name)}
                                    activeOpacity={0.8}
                                >
                                    <Card className="bg-white p-4 rounded-[1.8rem] shadow-sm border border-slate-50">
                                        <HStack className="items-center justify-between">
                                            <HStack className="items-center flex-1" space="md">
                                                <Box className={`p-3 rounded-2xl ${conn.id % 2 === 0 ? 'bg-[#FDF2F8]' : 'bg-[#EFF6FF]'}`}>
                                                    <Server size={22} color={conn.id % 2 === 0 ? '#db2777' : '#2563eb'} />
                                                </Box>
                                                <VStack className="flex-1">
                                                    <Text className="text-[#1e293b] font-bold text-base font-['InclusiveSans']" numberOfLines={1}>
                                                        {conn.name}
                                                    </Text>
                                                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-['InclusiveSans']" numberOfLines={1}>
                                                        {conn.uri.split('@').pop().split('/')[0].substring(0, 30)}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                            
                                            <HStack space="sm" className="items-center">
                                                <TouchableOpacity 
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        removeConnection(conn.id);
                                                    }}
                                                    className="bg-slate-50 p-2.5 rounded-xl active:bg-red-50"
                                                >
                                                    <Trash2 size={16} color="#F43F5E" />
                                                </TouchableOpacity>
                                                <Box className="bg-slate-50 p-1.5 rounded-full">
                                                    <ChevronRight size={14} color="#1e293b" />
                                                </Box>
                                            </HStack>
                                        </HStack>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </VStack>
                    )}
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}
