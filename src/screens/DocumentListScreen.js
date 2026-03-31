import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, Alert, TextInput, ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchDocuments, insertDocument, updateDocument, deleteDocument } from '../services/api';
import { 
    FileJson, 
    Edit2, 
    Trash2, 
    Plus, 
    X, 
    ArrowLeft, 
    ArrowRight, 
    Sun,
    Moon, 
    Check,
    LayoutGrid,
    Search,
    RefreshCw
} from 'lucide-react-native';

// Gluestack UI
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');

export default function DocumentListScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { dbName, collectionName } = route.params;
    const { activeUri } = useConnectionStore();
    const { isDark, toggleTheme } = useThemeStore();
    
    const [docs, setDocs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [jsonInput, setJsonInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadDocs(page);
    }, [activeUri, dbName, collectionName, page]);

    const loadDocs = async (pageNum) => {
        if (!activeUri || !dbName || !collectionName) return;
        setLoading(true);
        try {
            const data = await fetchDocuments(activeUri, dbName, collectionName, pageNum, 10);
            setDocs(data.documents || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            Alert.alert('Analysis Failed', error?.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedDoc(null);
        setJsonInput('{\n  "name": "New Record",\n  "status": "Active"\n}');
        setModalVisible(true);
    };

    const handleEdit = (doc) => {
        setSelectedDoc(doc);
        setJsonInput(JSON.stringify(doc, null, 2));
        setModalVisible(true);
    };

    const handleDelete = (doc) => {
        Alert.alert(
            'Delete Document',
            'Are you sure you want to delete this document permanently?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const filter = { _id: doc._id };
                            await deleteDocument(activeUri, dbName, collectionName, filter);
                            loadDocs(page);
                        } catch (error) {
                            Alert.alert('Delete Failed', error?.response?.data?.error || error.message);
                        }
                    }
                }
            ]
        );
    };

    const handleSave = async () => {
        let parsedDoc;
        try {
            parsedDoc = JSON.parse(jsonInput);
        } catch (e) {
            Alert.alert('Validation Error', 'Invalid JSON syntax detected.');
            return;
        }

        setIsSaving(true);
        try {
            if (selectedDoc) {
                const filter = { _id: selectedDoc._id };
                const updatePayload = { ...parsedDoc };
                delete updatePayload._id;
                await updateDocument(activeUri, dbName, collectionName, filter, updatePayload);
            } else {
                await insertDocument(activeUri, dbName, collectionName, parsedDoc);
            }
            setModalVisible(false);
            loadDocs(page);
        } catch (error) {
            Alert.alert('Operation Failed', error?.response?.data?.error || error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Theme colors
    const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-[#FAF9F6]';
    const cardColor = isDark ? 'bg-[#1e293b]' : 'bg-white';
    const textColor = isDark ? 'text-[#f8fafc]' : 'text-[#1e293b]';
    const mutedTextColor = isDark ? 'text-[#94a3b8]' : 'text-[#64748b]';
    const borderColor = isDark ? 'border-[#334155]' : 'border-slate-50';
    const jsonBgColor = isDark ? 'bg-[#0f172a]' : 'bg-slate-50/50';
    const iconSecondaryColor = isDark ? '#94a3b8' : '#1e293b';
    const placeholderColor = isDark ? '#475569' : '#94a3b8';

    const renderJsonItem = ({ item }) => (
        <Card className={`${cardColor} p-5 rounded-[2.5rem] mb-6 border ${borderColor} shadow-sm overflow-hidden`}>
            <HStack className={`justify-between items-center mb-4 pb-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <HStack space="sm" className="items-center">
                    <Box className={`${isDark ? 'bg-blue-900/30' : 'bg-[#EFF6FF]'} p-2.5 rounded-xl`}>
                        <FileJson size={18} color="#2563eb" />
                    </Box>
                    <VStack>
                        <Text className={`${textColor} font-black text-[10px] uppercase tracking-widest font-['MontserratBold']`}>DOCUMENT</Text>
                        <Text className={`${mutedTextColor} text-[8px] font-bold font-['Montserrat'] uppercase`}>ID: {String(item._id).substring(0, 14)}</Text>
                    </VStack>
                </HStack>
                <HStack space="xs">
                    <TouchableOpacity onPress={() => handleEdit(item)} className={`p-2.5 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-xl`}>
                        <Edit2 size={16} color={iconSecondaryColor} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} className={`p-2.5 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-xl`}>
                        <Trash2 size={16} color="#f43f5e" />
                    </TouchableOpacity>
                </HStack>
            </HStack>
            <Box className={`${jsonBgColor} p-5 rounded-3xl border ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <Text className={`${isDark ? 'text-teal-400' : 'text-[#334155]'} font-['Montserrat'] text-[11px] leading-6`}>
                    {JSON.stringify(item, null, 2)}
                </Text>
            </Box>
        </Card>
    );

    return (
        <SafeAreaView className={`flex-1 ${bgColor}`}>
            {/* Custom Premium Header */}
            <VStack className="px-7 pt-10 pb-4" space="lg">
                <HStack className="justify-between items-center">
                    <HStack space="md" className="items-center flex-1">
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            className={`${cardColor} p-2.5 rounded-xl shadow-sm border ${borderColor}`}
                        >
                            <ArrowLeft size={20} color={iconSecondaryColor} />
                        </TouchableOpacity>
                        <VStack className="flex-1">
                            <Text className={`${textColor} text-2xl font-black font-['MontserratBlack'] tracking-tighter`} numberOfLines={1}>{collectionName}</Text>
                            <Text className={`${mutedTextColor} text-[11px] font-bold uppercase tracking-widest font-['MontserratBold'] mt-1`}>Documents</Text>
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
                            onPress={handleAdd}
                            className={`${isDark ? 'bg-teal-600' : 'bg-[#1e293b]'} h-14 w-14 items-center justify-center rounded-[1.5rem] shadow-lg ${isDark ? 'shadow-teal-900/40' : 'shadow-slate-900/10'} ml-2`}
                        >
                            <Plus size={24} color="white" />
                        </TouchableOpacity>
                    </HStack>
                </HStack>
            </VStack>
            
            {loading ? (
                <VStack className="flex-1 justify-center items-center">
                    <Spinner size="large" color={iconSecondaryColor} />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-['Montserrat'] mt-6">Loading Documents...</Text>
                </VStack>
            ) : (
                <View className="flex-1 px-7 mt-4">
                    <FlatList
                        data={docs}
                        keyExtractor={(item) => String(item._id || Math.random())}
                        renderItem={renderJsonItem}
                        contentContainerStyle={{ paddingBottom: 150 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <VStack className="items-center mt-20" space="md">
                                <Box className={`${cardColor} p-6 rounded-full border border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <FileJson size={48} color="#cbd5e1" />
                                </Box>
                                <Text className="text-slate-400 text-sm font-medium font-['Montserrat'] text-center">No documents found.</Text>
                            </VStack>
                        }
                    />
                </View>
            )}

            {/* Pagination Controls */}
            <Box className={`absolute bottom-6 left-7 right-7 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-[#1e293b]'} rounded-[2rem] p-3 shadow-2xl`}>
                <HStack className="justify-between items-center">
                    <TouchableOpacity 
                        onPress={() => setPage(Math.max(1, page - 1))} 
                        className={`${isDark ? 'bg-slate-700' : 'bg-slate-700'} rounded-2xl h-11 w-11 items-center justify-center ${page === 1 ? 'opacity-30' : ''}`}
                    >
                        <ArrowLeft size={18} color="white" />
                    </TouchableOpacity>
                    <VStack className="items-center">
                        <Text className="text-white font-black tracking-[0.2em] text-[10px] font-['Montserrat'] uppercase">PAGE {page} OF {Math.max(1, totalPages)}</Text>
                    </VStack>
                    <TouchableOpacity 
                        onPress={() => setPage(Math.min(totalPages, page + 1))} 
                        className={`${isDark ? 'bg-slate-700' : 'bg-slate-700'} rounded-2xl h-11 w-11 items-center justify-center ${page >= totalPages ? 'opacity-30' : ''}`}
                    >
                        <ArrowRight size={18} color="white" />
                    </TouchableOpacity>
                </HStack>
            </Box>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="full">
                <ModalBackdrop />
                <ModalContent className={`${isDark ? 'bg-[#0f172a]' : 'bg-[#FAF9F6]'} rounded-t-[3rem] h-[90%] mt-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <ModalHeader className="p-8 pb-4">
                        <VStack space="xs">
                            <Text className={`${textColor} font-black text-3xl font-['MontserratBlack'] tracking-tighter`}>{selectedDoc ? 'Edit Document' : 'Insert Document'}</Text>
                            <HStack space="xs" className="items-center">
                                <LayoutGrid size={10} color={placeholderColor} />
                                <Text className={`${mutedTextColor} text-[10px] font-bold uppercase tracking-[0.2em] font-['MontserratBold']`}>JSON Editor</Text>
                            </HStack>
                        </VStack>
                        <ModalCloseButton className={`${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-full p-2.5`}>
                             <X size={20} color={iconSecondaryColor} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="p-6">
                        <Box className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} rounded-[2.5rem] border p-8 shadow-inner flex-1`}>
                            <VStack space="md" className="flex-1">
                                <ScrollView className="flex-1">
                                    <TextInput
                                        className={`${isDark ? 'text-teal-400' : 'text-[#1e293b]'} font-['Montserrat'] text-sm leading-8`}
                                        multiline
                                        textAlignVertical="top"
                                        value={jsonInput}
                                        onChangeText={setJsonInput}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholderTextColor={placeholderColor}
                                    />
                                </ScrollView>
                            </VStack>
                        </Box>
                    </ModalBody>
                    <ModalFooter className="p-8">
                        <Button 
                            className={`${isDark ? 'bg-teal-600' : 'bg-[#1e293b]'} rounded-[1.8rem] h-16 w-full shadow-2xl`} 
                            onPress={handleSave} 
                            disabled={isSaving}
                        >
                            {isSaving ? <Spinner color="white" /> : (
                                <HStack space="sm" className="items-center">
                                    <Check size={20} color="white" />
                                    <ButtonText className="font-extrabold text-xl font-['MontserratBold'] text-white">Save Document</ButtonText>
                                </HStack>
                            )}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SafeAreaView>
    );
}
