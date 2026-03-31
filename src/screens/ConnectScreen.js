import React, { useState } from 'react';
import { ScrollView, Alert, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { connectDb } from '../services/api';
import { Database, Trash2, ChevronRight, Server, Link, ShieldCheck, Zap } from 'lucide-react-native';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText, ButtonSpinner, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, InputField } from '@/components/ui/input';
import { Divider } from '@/components/ui/divider';

const { width } = Dimensions.get('window');

export default function ConnectScreen() {
    const navigation = useNavigation();
    const { connections, addConnection, removeConnection, setActiveUri } = useConnectionStore();
    
    const [uri, setUri] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConnect = async (connectUri, saveName = null) => {
        const targetUri = connectUri || uri;
        setLoading(true);
        try {
            await connectDb(targetUri);
            setActiveUri(targetUri || 'Default');
            
            if (targetUri && !connections.find(c => c.uri === targetUri)) {
                addConnection({ uri: targetUri, name: saveName || 'Node ' + (connections.length + 1) });
            }
            
            navigation.navigate('Databases');
        } catch (error) {
            Alert.alert('Connection Failed', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FBFA]">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                <VStack className="pt-10 pb-8" space="xl">
                    {/* Brand Header */}
                    <VStack space="xs">
                        <HStack className="items-center" space="sm">
                            <Box className="bg-[#00796B] p-2 rounded-xl">
                                <Database size={20} color="white" />
                            </Box>
                            <Text className="text-[#004D40] text-sm font-bold uppercase tracking-widest font-['InclusiveSans']">
                                MongoMobile Client
                            </Text>
                        </HStack>
                        <Text className="text-[#004D40] text-3xl font-black leading-tight font-['InclusiveSans'] mt-2">
                             Secure Database {"\n"}Explorer <Text className="text-[#00796B] font-['InclusiveSans']">MongoDB</Text>
                        </Text>
                        <Text className="text-slate-500 text-sm font-medium font-['InclusiveSans'] mt-1">
                            Connect to your clusters with end-to-end encryption.
                        </Text>
                    </VStack>

                    {/* Connection Form Card */}
                    <Card className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-[#E1F1F0]">
                        <VStack space="lg">
                            <HStack className="items-center justify-between">
                                <HStack space="xs" className="items-center">
                                    <Box className="bg-[#E0F2F1] p-2 rounded-full">
                                        <Link size={16} color="#00796B" />
                                    </Box>
                                    <Text className="text-[#004D40] font-bold text-base font-['InclusiveSans'] underline decoration-teal-500/30">Target Cluster</Text>
                                </HStack>
                                <Box className="bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                    <ShieldCheck size={12} color="#059669" />
                                </Box>
                            </HStack>

                            <Input 
                                variant="rounded" 
                                size="lg" 
                                className="bg-[#F5F9F8] border-[#E0F2F1] h-14 shadow-inner"
                            >
                                <InputField 
                                    className="text-[#004D40] font-['InclusiveSans'] text-sm"
                                    placeholder="Connection Name (Optional)"
                                    placeholderTextColor="#94A3B8"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </Input>

                            <Input 
                                variant="rounded" 
                                size="lg" 
                                className="bg-[#F5F9F8] border-[#E0F2F1] h-14 shadow-inner"
                            >
                                <InputField 
                                    className="text-[#004D40] font-['InclusiveSans'] text-sm"
                                    placeholder="mongodb+srv://user:pass@host..."
                                    placeholderTextColor="#94A3B8"
                                    value={uri}
                                    onChangeText={setUri}
                                    autoCapitalize="none"
                                    secureTextEntry
                                />
                            </Input>

                            <Button 
                                size="xl"
                                className="bg-[#00796B] rounded-2xl h-14 mt-2 shadow-lg shadow-teal-500/30"
                                onPress={() => handleConnect(uri, name)}
                                disabled={loading}
                            >
                                {loading ? <ButtonSpinner color="white" /> : <ButtonText className="font-bold text-lg font-['InclusiveSans']">Connect to Node</ButtonText>}
                            </Button>
                        </VStack>
                    </Card>

                    {/* Saved Connections Section */}
                    {connections.length > 0 && (
                        <VStack space="md" className="mt-4">
                            <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1 font-['InclusiveSans']">
                                RECENTLY MANAGED DATA OBJECTS
                            </Text>
                            
                            {connections.map((conn) => (
                                <TouchableOpacity 
                                    key={conn.id} 
                                    onPress={() => handleConnect(conn.uri, conn.name)}
                                    activeOpacity={0.7}
                                >
                                    <Card className="bg-white p-4 rounded-3xl shadow-sm border border-[#E0F2F1] relative overflow-hidden">
                                        <HStack className="items-center justify-between">
                                            <HStack className="items-center flex-1" space="md">
                                                <Box className="bg-[#F3E5F5] p-3 rounded-2xl">
                                                    <Zap size={22} color="#9C27B0" />
                                                </Box>
                                                <VStack className="flex-1">
                                                    <Text className="text-[#004D40] font-bold text-base font-['InclusiveSans']" numberOfLines={1}>
                                                        {conn.name}
                                                    </Text>
                                                    <Text className="text-slate-400 text-[10px] font-medium font-['InclusiveSans']" numberOfLines={1}>
                                                        {conn.uri.split('@').pop()}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                            
                                            <HStack space="xs" className="items-center">
                                                <TouchableOpacity 
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        removeConnection(conn.id);
                                                    }}
                                                    className="p-2"
                                                >
                                                    <Trash2 size={16} color="#F43F5E" />
                                                </TouchableOpacity>
                                                <Box className="bg-[#00796B] p-1.5 rounded-full">
                                                    <ChevronRight size={14} color="white" />
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
