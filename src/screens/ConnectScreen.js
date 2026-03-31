import React, { useState } from 'react';
import { ScrollView, Alert, Dimensions, TouchableOpacity, TextInput, Image } from 'react-native';
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
    Sun,
    Moon, 
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
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');

export default function ConnectScreen() {
    const navigation = useNavigation();
    const { connections, addConnection, removeConnection, setActiveUri } = useConnectionStore();
    const { isDark, toggleTheme } = useThemeStore();
    
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

    // Theme-based colors
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-[#FAF9F6]';
    const cardColor = isDark ? 'bg-[#1e293b]' : 'bg-white';
    const textColor = isDark ? 'text-[#f8fafc]' : 'text-[#1e293b]';
    const mutedTextColor = isDark ? 'text-[#94a3b8]' : 'text-[#64748b]';
    const inputBgColor = isDark ? 'bg-[#334155]' : 'bg-slate-50';
    const borderColor = isDark ? 'border-[#334155]' : 'border-slate-100';
    const placeholderColor = isDark ? '#64748b' : '#94a3b8';
    const iconColor = isDark ? '#94a3b8' : '#64748b';

    return (
        <SafeAreaView className={`flex-1 ${bgColor}`}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <VStack className="px-7 pt-12 pb-10" space="xl">
                    
                    {/* Premium Branding Header */}
                    <VStack space="md" className="mb-4">
                        <HStack className="items-center justify-between">
                            <HStack space="md" className="items-center">
                                <Box className={`${isDark ? 'bg-transparent' : 'bg-[#1e293b]'} p-1 rounded-full`}>
                                    <Image 
                                        source={require('../../assets/logo.png')} 
                                        style={{ width: 44, height: 44, borderRadius: 100 }} 
                                        resizeMode="contain"
                                    />
                                </Box>
                                <Text className={`${textColor} text-sm font-black uppercase tracking-[0.1em] font-['MontserratBold']`}>
                                    mongoDB Compass
                                </Text>
                            </HStack>
                            <TouchableOpacity 
                                onPress={toggleTheme}
                                className={`${cardColor} p-2.5 rounded-xl border ${borderColor} shadow-sm`}
                            >
                                {isDark ? (
                                    <Sun size={18} color="#fbbf24" fill="#fbbf24" />
                                ) : (
                                    <Moon size={18} color="#64748b" fill="#64748b" />
                                )}
                            </TouchableOpacity>
                        </HStack>
                        
                        <VStack className="mt-4">
                            <Text className={`${textColor} text-4xl font-black leading-[1.1] font-['MontserratBlack'] tracking-tighter`}>
                                MongoDB {"\n"}<Text className="text-teal-600 font-['MontserratBlack']">Atlas Cluster</Text>
                            </Text>
                            <Text className={`${mutedTextColor} text-sm font-medium font-['Montserrat'] mt-3 leading-6`}>
                                Connect to your MongoDB databases locally or in the cloud with secure TLS encryption.
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Connection Configuration Hub */}
                    <Card className={`${cardColor} p-7 rounded-[2.5rem] shadow-xl ${isDark ? 'shadow-black/20' : 'shadow-slate-900/5'} border ${borderColor}`}>
                        <VStack space="lg">
                            <HStack className="items-center justify-between">
                                <HStack space="xs" className="items-center">
                                    <Box className={`${isDark ? 'bg-blue-900/40' : 'bg-[#EFF6FF]'} p-2 rounded-full`}>
                                        <Plus size={14} color="#2563eb" />
                                    </Box>
                                    <Text className={`${textColor} font-black text-xs uppercase tracking-widest font-['MontserratBold']`}>New Connection</Text>
                                </HStack>
                                <Box className={`${isDark ? 'bg-emerald-900/40 border-emerald-800' : 'bg-emerald-50 border-emerald-100'} px-2.5 py-1.5 rounded-xl border`}>
                                    <ShieldCheck size={14} color="#059669" />
                                </Box>
                            </HStack>

                            <VStack space="md">
                                <Box className={`${inputBgColor} px-5 rounded-[1.2rem] h-14 flex-row items-center border ${borderColor}`}>
                                    <Search size={16} color={placeholderColor} />
                                    <TextInput 
                                        className={`flex-1 ml-3 ${textColor} font-['InclusiveSans'] text-sm`}
                                        placeholder="Connection Nickname (Optional)"
                                        placeholderTextColor={placeholderColor}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </Box>

                                <Box className={`${inputBgColor} px-5 rounded-[1.2rem] h-14 flex-row items-center border ${borderColor}`}>
                                    <Link size={16} color={placeholderColor} />
                                    <TextInput 
                                        className={`flex-1 ml-3 ${textColor} font-['InclusiveSans'] text-sm`}
                                        placeholder="mongodb+srv://user:pass@host..."
                                        placeholderTextColor={placeholderColor}
                                        value={uri}
                                        onChangeText={setUri}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </Box>
                            </VStack>

                            <Button 
                                size="xl"
                                className={`${isDark ? 'bg-teal-600' : 'bg-[#1e293b]'} rounded-[1.5rem] h-16 mt-2 shadow-2xl ${isDark ? 'shadow-teal-900/40' : 'shadow-slate-900/20'}`}
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
                                <Text className={`${mutedTextColor} font-black text-[10px] uppercase tracking-[0.2em] font-['MontserratBold']`}>
                                    RECENT CONNECTIONS
                                </Text>
                                <LayoutGrid size={14} color={iconColor} />
                            </HStack>
                            
                            {connections.map((conn) => (
                                <TouchableOpacity 
                                    key={conn.id} 
                                    onPress={() => handleConnect(conn.uri, conn.name)}
                                    activeOpacity={0.8}
                                >
                                    <Card className={`${cardColor} p-4 rounded-[1.8rem] shadow-sm border ${borderColor}`}>
                                        <HStack className="items-center justify-between">
                                            <HStack className="items-center flex-1" space="md">
                                                <Box className={`p-3 rounded-2xl ${conn.id % 2 === 0 
                                                    ? (isDark ? 'bg-pink-900/30' : 'bg-[#FDF2F8]') 
                                                    : (isDark ? 'bg-blue-900/30' : 'bg-[#EFF6FF]')}`}>
                                                    <Server size={22} color={conn.id % 2 === 0 ? '#db2777' : '#2563eb'} />
                                                </Box>
                                                <VStack className="flex-1">
                                                    <Text className={`${textColor} font-bold text-base font-['InclusiveSans']`} numberOfLines={1}>
                                                        {conn.name}
                                                    </Text>
                                                    <Text className={`${mutedTextColor} text-[10px] font-bold uppercase tracking-widest font-['InclusiveSans']`} numberOfLines={1}>
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
                                                    className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-2.5 rounded-xl active:bg-red-50`}
                                                >
                                                    <Trash2 size={16} color="#F43F5E" />
                                                </TouchableOpacity>
                                                <Box className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-1.5 rounded-full`}>
                                                    <ChevronRight size={14} color={iconColor} />
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
