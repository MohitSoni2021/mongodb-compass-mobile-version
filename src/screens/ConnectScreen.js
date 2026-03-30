import React, { useState } from 'react';
import { ScrollView, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { connectDb } from '../services/api';
import { Database, Trash2, ChevronRight, Server } from 'lucide-react-native';

// Gluestack UI Components
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, InputField } from '@/components/ui/input';
import { Divider } from '@/components/ui/divider';

export default function ConnectScreen() {
    const navigation = useNavigation();
    const { connections, addConnection, removeConnection, activeUri, setActiveUri } = useConnectionStore();
    
    const [uri, setUri] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConnect = async (connectUri, saveName = null) => {
        const targetUri = connectUri || uri;
        if (!targetUri && !process.env.MONGO_URI) {
            Alert.alert('Error', 'Please enter a valid MongoDB URI');
            return;
        }

        setLoading(true);
        try {
            await connectDb(targetUri); // Backend will use env if targetUri is empty
            setActiveUri(targetUri || 'Default');
            
            if (targetUri && !connections.find(c => c.uri === targetUri)) {
                addConnection({ uri: targetUri, name: saveName || 'Connection ' + (connections.length + 1) });
            }
            
            navigation.navigate('Databases');
        } catch (error) {
            Alert.alert('Connection Failed', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-5">
                <VStack className="items-center mb-10 mt-8" space="md">
                    <Box className="bg-emerald-500/20 p-5 rounded-[2rem] border border-emerald-500/30">
                        <Database size={48} color="#10b981" />
                    </Box>
                    <VStack className="items-center">
                        <Text className="text-4xl font-black text-white tracking-tighter">MongoMobile</Text>
                        <Text className="text-slate-400 text-base font-medium">Cloud Database Manager</Text>
                    </VStack>
                </VStack>

                {/* Glassmorphism Connect Card */}
                <Card className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-700/40 shadow-2xl mb-8 backdrop-blur-xl">
                    <Text className="text-white font-bold text-xl mb-6">New Connection</Text>
                    
                    <VStack space="lg">
                        <VStack space="xs">
                            <Text className="text-slate-400 text-xs font-bold ml-1 uppercase tracking-widest">Connection Name</Text>
                            <Input size="xl" className="bg-slate-950/50 border-slate-700/50 rounded-2xl h-14">
                                <InputField 
                                    className="text-white placeholder:text-slate-600"
                                    placeholder="Ex: Production Cluster"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text className="text-slate-400 text-xs font-bold ml-1 uppercase tracking-widest">MongoDB URI</Text>
                            <Input size="xl" className="bg-slate-950/50 border-slate-700/50 rounded-2xl h-14">
                                <InputField 
                                    className="text-white placeholder:text-slate-600"
                                    placeholder="mongodb+srv://..."
                                    value={uri}
                                    onChangeText={setUri}
                                    autoCapitalize="none"
                                    secureTextEntry
                                />
                            </Input>
                            <Text className="text-slate-500 text-[10px] ml-1 mt-1">Leave empty to use default cluster in backend</Text>
                        </VStack>

                        <Button 
                            size="xl"
                            className="bg-emerald-500 rounded-2xl h-14 mt-4 shadow-xl shadow-emerald-500/20"
                            onPress={() => handleConnect(uri, name)}
                            disabled={loading}
                        >
                            {loading ? <ButtonSpinner color="white" /> : <ButtonText className="font-bold text-lg">Connect to Server</ButtonText>}
                        </Button>
                    </VStack>
                </Card>

                {/* Saved Connections */}
                {connections.length > 0 && (
                    <VStack space="md">
                        <HStack className="items-center px-2 mb-2">
                            <Text className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Recent Nodes</Text>
                            <Divider className="flex-1 ml-4 bg-slate-800" />
                        </HStack>
                        
                        {connections.map((conn) => (
                            <Box key={conn.id} className="relative mb-3">
                                <Card 
                                    className="bg-slate-900/30 border border-slate-700/30 p-0 rounded-2xl overflow-hidden active:bg-slate-800/50"
                                >
                                    <HStack className="items-center p-4">
                                        <Box className="bg-slate-800/80 p-3 rounded-xl mr-4 border border-slate-700/50">
                                            <Server size={20} color="#10b981" />
                                        </Box>
                                        <VStack className="flex-1">
                                            <Text className="text-white font-bold text-base" numberOfLines={1}>{conn.name}</Text>
                                            <Text className="text-slate-500 text-xs mt-0.5" numberOfLines={1}>{conn.uri.split('@').pop()}</Text>
                                        </VStack>
                                        <HStack space="xs" className="items-center">
                                            <Button 
                                                variant="link" 
                                                className="px-2"
                                                onPress={() => removeConnection(conn.id)}
                                            >
                                                <Trash2 size={18} color="#f43f5e" />
                                            </Button>
                                            <Button 
                                                variant="link" 
                                                className="px-2"
                                                onPress={() => handleConnect(conn.uri, conn.name)}
                                            >
                                                <ChevronRight size={20} color="#475569" />
                                            </Button>
                                        </HStack>
                                    </HStack>
                                </Card>
                            </Box>
                        ))}
                    </VStack>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
