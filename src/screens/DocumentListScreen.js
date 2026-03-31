import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, Alert, SafeAreaView, TextInput, ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
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
    List, 
    Columns, 
    Eye,
    ChevronLeft,
    Check,
    Tag,
    Layers,
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

const { width } = Dimensions.get('window');

export default function DocumentListScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { dbName, collectionName } = route.params;
    const { activeUri } = useConnectionStore();
    
    const [docs, setDocs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('json');

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

    const tableHeaders = useMemo(() => {
        if (!docs || docs.length === 0) return ['_id'];
        const allKeys = new Set();
        docs.slice(0, 5).forEach(doc => {
            Object.keys(doc).forEach(key => allKeys.add(key));
        });
        return Array.from(allKeys).slice(0, 5);
    }, [docs]);

    const renderJsonItem = ({ item }) => (
        <Card className="bg-white p-5 rounded-[2.5rem] mb-6 border border-slate-50 shadow-sm overflow-hidden">
            <HStack className="justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <HStack space="sm" className="items-center">
                    <Box className="bg-[#EFF6FF] p-2.5 rounded-xl">
                        <FileJson size={18} color="#2563eb" />
                    </Box>
                    <VStack>
                        <Text className="text-[#1e293b] font-black text-[10px] uppercase tracking-widest font-['MontserratBold']">DOCUMENT</Text>
                        <Text className="text-slate-400 text-[8px] font-bold font-['Montserrat'] uppercase">ID: {String(item._id).substring(0, 14)}</Text>
                    </VStack>
                </HStack>
                <HStack space="xs">
                    <TouchableOpacity onPress={() => handleEdit(item)} className="p-2.5 bg-slate-50 rounded-xl">
                        <Edit2 size={16} color="#1e293b" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} className="p-2.5 bg-slate-50 rounded-xl">
                        <Trash2 size={16} color="#f43f5e" />
                    </TouchableOpacity>
                </HStack>
            </HStack>
            <Box className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                <Text className="text-[#334155] font-['InclusiveSans'] text-[11px] leading-6">
                    {JSON.stringify(item, null, 2)}
                </Text>
            </Box>
        </Card>
    );

    const renderListItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => handleEdit(item)}
            activeOpacity={0.8}
        >
            <Card className="bg-white p-4 rounded-[1.8rem] mb-3 border border-slate-50 shadow-sm">
                <HStack className="items-center justify-between">
                    <HStack className="items-center flex-1" space="md">
                        <Box className="bg-[#FDF2F8] p-3 rounded-2xl">
                            <Layers size={20} color="#db2777" />
                        </Box>
                        <VStack className="flex-1">
                            <Text className="text-[#1e293b] font-black text-sm font-['InclusiveSans']" numberOfLines={1}>
                                {item.name || String(item._id)}
                            </Text>
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-['InclusiveSans']" numberOfLines={1}>
                                Fields: {Object.keys(item).length} • ID: {String(item._id).substring(0, 12)}...
                            </Text>
                        </VStack>
                    </HStack>
                    <Box className="bg-slate-50 p-2 rounded-full border border-slate-100">
                        <Eye size={12} color="#1e293b" />
                    </Box>
                </HStack>
            </Card>
        </TouchableOpacity>
    );

    const renderTableView = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <VStack className="border border-slate-100 rounded-[2.5rem] overflow-hidden bg-white shadow-sm">
                <HStack className="bg-[#1e293b] p-4 min-w-[750px] h-14 items-center">
                    {tableHeaders.map((header, idx) => (
                        <Box 
                            key={idx} 
                            className={`flex-1 px-4 border-r border-slate-700 ${idx === tableHeaders.length - 1 ? 'border-r-0' : ''}`}
                        >
                            <Text className="text-white font-black text-[9px] uppercase tracking-[0.1em] font-['InclusiveSans'] text-center">{header}</Text>
                        </Box>
                    ))}
                    <Box className="w-16 h-full items-center justify-center">
                        <Tag size={14} color="white" />
                    </Box>
                </HStack>
                {docs.map((doc, dIdx) => (
                    <TouchableOpacity 
                        key={dIdx} 
                        onPress={() => handleEdit(doc)}
                        activeOpacity={0.8}
                    >
                        <HStack className={`bg-white border-b border-slate-50 p-4 min-w-[750px] items-center ${dIdx === docs.length - 1 ? 'border-b-0' : ''}`}>
                            {tableHeaders.map((header, hIdx) => (
                                <Box 
                                    key={hIdx} 
                                    className={`flex-1 px-4 border-r border-slate-50 ${hIdx === tableHeaders.length - 1 ? 'border-r-0' : ''}`}
                                >
                                    <Text className="text-[#1e293b] text-xs font-['InclusiveSans'] text-center" numberOfLines={1}>
                                        {typeof doc[header] === 'object' ? '{...}' : String(doc[header] || '-')}
                                    </Text>
                                </Box>
                            ))}
                            <TouchableOpacity 
                                className="w-16 items-center justify-center" 
                                onPress={() => handleDelete(doc)}
                            >
                                <Box className="bg-pink-50 p-2 rounded-xl">
                                    <Trash2 size={13} color="#f43f5e" />
                                </Box>
                            </TouchableOpacity>
                        </HStack>
                    </TouchableOpacity>
                ))}
            </VStack>
        </ScrollView>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#FAF9F6]">
            {/* Custom Premium Header */}
            <VStack className="px-7 pt-10 pb-4" space="lg">
                <HStack className="justify-between items-center">
                    <HStack space="md" className="items-center flex-1">
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-50"
                        >
                            <ArrowLeft size={20} color="#1e293b" />
                        </TouchableOpacity>
                        <VStack className="flex-1">
                            <Text className="text-[#1e293b] text-2xl font-black font-['MontserratBlack'] tracking-tighter" numberOfLines={1}>{collectionName}</Text>
                            <Text className="text-[#64748b] text-[11px] font-bold uppercase tracking-widest font-['MontserratBold'] mt-1">Documents</Text>
                        </VStack>
                    </HStack>
                    <TouchableOpacity 
                        onPress={handleAdd}
                        className="bg-[#1e293b] h-14 w-14 items-center justify-center rounded-[1.5rem] shadow-lg shadow-slate-900/10 ml-2"
                    >
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                </HStack>

                {/* View Switcher - Premium Style */}
                <HStack className="bg-slate-100 p-1.5 rounded-[1.8rem] self-center mt-2" space="xs">
                    <TouchableOpacity 
                        onPress={() => setViewType('json')} 
                        className={`rounded-[1.2rem] px-5 h-10 flex-row items-center ${viewType === 'json' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <FileJson size={14} color={viewType === 'json' ? '#1e293b' : '#94a3b8'} />
                        <Text className={`ml-2 font-black text-[10px] font-['InclusiveSans'] uppercase tracking-wider ${viewType === 'json' ? 'text-[#1e293b]' : 'text-[#94a3b8]'}`}>JSON</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setViewType('list')} 
                        className={`rounded-[1.2rem] px-5 h-10 flex-row items-center ${viewType === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <List size={14} color={viewType === 'list' ? '#1e293b' : '#94a3b8'} />
                        <Text className={`ml-2 font-black text-[10px] font-['InclusiveSans'] uppercase tracking-wider ${viewType === 'list' ? 'text-[#1e293b]' : 'text-[#94a3b8]'}`}>LIST</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setViewType('table')} 
                        className={`rounded-[1.2rem] px-5 h-10 flex-row items-center ${viewType === 'table' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <Columns size={14} color={viewType === 'table' ? '#1e293b' : '#94a3b8'} />
                        <Text className={`ml-2 font-black text-[10px] font-['InclusiveSans'] uppercase tracking-wider ${viewType === 'table' ? 'text-[#1e293b]' : 'text-[#94a3b8]'}`}>TABLE</Text>
                    </TouchableOpacity>
                </HStack>
            </VStack>
            
            {loading ? (
                <VStack className="flex-1 justify-center items-center">
                    <Spinner size="large" color="#1e293b" />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans'] mt-6">Loading Documents...</Text>
                </VStack>
            ) : (
                <View className="flex-1 px-7">
                    {viewType === 'table' ? (
                        <FlatList
                            data={[1]}
                            renderItem={renderTableView}
                            contentContainerStyle={{ paddingBottom: 150 }}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <FlatList
                            data={docs}
                            keyExtractor={(item) => String(item._id || Math.random())}
                            renderItem={viewType === 'json' ? renderJsonItem : renderListItem}
                            contentContainerStyle={{ paddingBottom: 150 }}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <VStack className="items-center mt-20" space="md">
                                    <Box className="bg-white p-6 rounded-full border border-dashed border-slate-200">
                                        <FileJson size={48} color="#cbd5e1" />
                                    </Box>
                                    <Text className="text-slate-400 text-sm font-medium font-['InclusiveSans'] text-center">No documents found.</Text>
                                </VStack>
                            }
                        />
                    )}
                </View>
            )}

            {/* Pagination Controls */}
            <Box className="absolute bottom-6 left-7 right-7 bg-[#1e293b] rounded-[2rem] p-3 shadow-2xl">
                <HStack className="justify-between items-center">
                    <TouchableOpacity 
                        onPress={() => setPage(Math.max(1, page - 1))} 
                        className={`bg-slate-700 rounded-2xl h-11 w-11 items-center justify-center ${page === 1 ? 'opacity-30' : ''}`}
                    >
                        <ArrowLeft size={18} color="white" />
                    </TouchableOpacity>
                    <VStack className="items-center">
                        <Text className="text-white font-black tracking-[0.2em] text-[10px] font-['InclusiveSans'] uppercase">PAGE {page} OF {Math.max(1, totalPages)}</Text>
                    </VStack>
                    <TouchableOpacity 
                        onPress={() => setPage(Math.min(totalPages, page + 1))} 
                        className={`bg-slate-700 rounded-2xl h-11 w-11 items-center justify-center ${page >= totalPages ? 'opacity-30' : ''}`}
                    >
                        <ArrowRight size={18} color="white" />
                    </TouchableOpacity>
                </HStack>
            </Box>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="full">
                <ModalBackdrop />
                <ModalContent className="bg-[#FAF9F6] rounded-t-[3rem] h-[90%] mt-auto border-t border-slate-200">
                    <ModalHeader className="p-8 pb-4">
                        <VStack space="xs">
                            <Text className="text-[#1e293b] font-black text-3xl font-['MontserratBlack'] tracking-tighter">{selectedDoc ? 'Edit Document' : 'Insert Document'}</Text>
                            <HStack space="xs" className="items-center">
                                <LayoutGrid size={10} color="#64748B" />
                                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] font-['MontserratBold']">JSON Editor</Text>
                            </HStack>
                        </VStack>
                        <ModalCloseButton className="bg-slate-100 rounded-full p-2.5">
                             <X size={20} color="#1e293b" />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="p-6">
                        <Box className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-inner flex-1">
                            <VStack space="md" className="flex-1">
                                <ScrollView className="flex-1">
                                    <TextInput
                                        className="text-[#1e293b] font-['InclusiveSans'] text-sm leading-8"
                                        multiline
                                        textAlignVertical="top"
                                        value={jsonInput}
                                        onChangeText={setJsonInput}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholderTextColor="#94A3B8"
                                    />
                                </ScrollView>
                            </VStack>
                        </Box>
                    </ModalBody>
                    <ModalFooter className="p-8">
                        <Button 
                            className="bg-[#1e293b] rounded-[1.8rem] h-16 w-full shadow-2xl" 
                            onPress={handleSave} 
                            disabled={isSaving}
                        >
                            {isSaving ? <Spinner color="white" /> : (
                                <HStack space="sm" className="items-center">
                                    <Check size={20} color="white" />
                                    <ButtonText className="font-extrabold text-xl font-['InclusiveSans']">Save Document</ButtonText>
                                </HStack>
                            )}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SafeAreaView>
    );
}
