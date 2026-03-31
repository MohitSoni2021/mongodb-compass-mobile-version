import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, Alert, SafeAreaView, TextInput, ScrollView, View, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchDocuments, insertDocument, updateDocument, deleteDocument } from '../services/api';
import { FileJson, Edit2, Trash2, Plus, X, ArrowLeft, ArrowRight, Save, LayoutGrid, Database, Terminal, List, Columns, Eye } from 'lucide-react-native';

// Gluestack UI
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';

export default function DocumentListScreen() {
    const route = useRoute();
    const { dbName, collectionName } = route.params;
    const { activeUri } = useConnectionStore();
    
    const [docs, setDocs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('json'); // json, list, table

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
            setDocs(data.documents);
            setTotalPages(data.totalPages);
        } catch (error) {
            Alert.alert('Error', error?.response?.data?.error || error.message);
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
            'Remove this BSON object permanently?',
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
            Alert.alert('Invalid JSON', 'Please format your JSON properly.');
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
            Alert.alert('Save Failed', error?.response?.data?.error || error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const tableHeaders = useMemo(() => {
        if (docs.length === 0) return ['_id'];
        const allKeys = new Set();
        docs.slice(0, 5).forEach(doc => {
            Object.keys(doc).forEach(key => allKeys.add(key));
        });
        return Array.from(allKeys).slice(0, 5); 
    }, [docs]);

    const renderJsonItem = ({ item }) => (
        <Card className="bg-white p-5 rounded-[2.5rem] mb-6 border border-[#E0F2F1] shadow-xl shadow-teal-900/5">
            <HStack className="justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <HStack space="sm" className="items-center">
                    <Box className="bg-[#E1F5FE] p-2.5 rounded-xl">
                        <FileJson size={16} color="#0288D1" />
                    </Box>
                    <VStack>
                        <Text className="text-[#0288D1] font-black text-[9px] uppercase tracking-widest font-['InclusiveSans']">BSON OBJECT</Text>
                        <Text className="text-slate-400 text-[8px] font-bold font-['InclusiveSans']">REF_ID: {String(item._id).substring(0, 8)}...</Text>
                    </VStack>
                </HStack>
                <HStack space="xs">
                    <TouchableOpacity onPress={() => handleEdit(item)} className="p-2 bg-slate-50 rounded-xl">
                        <Edit2 size={16} color="#00796B" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} className="p-2 bg-slate-50 rounded-xl">
                        <Trash2 size={16} color="#F43F5E" />
                    </TouchableOpacity>
                </HStack>
            </HStack>
            <Box className="bg-[#F8FBFA] p-5 rounded-2xl border border-slate-100">
                <Text className="text-[#004D40] font-mono text-[11px] leading-6">
                    {JSON.stringify(item, null, 2)}
                </Text>
            </Box>
        </Card>
    );

    const renderListItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => handleEdit(item)}
            activeOpacity={0.7}
        >
            <Card className="bg-white p-4 rounded-3xl mb-3 border border-[#E0F2F1] shadow-sm">
                <HStack className="items-center justify-between">
                    <HStack className="items-center flex-1" space="md">
                        <Box className="bg-[#F1F8E9] p-3 rounded-2xl">
                            <List size={20} color="#558B2F" />
                        </Box>
                        <VStack className="flex-1">
                            <Text className="text-[#004D40] font-bold text-sm font-['InclusiveSans']" numberOfLines={1}>
                                {item.name || item._id}
                            </Text>
                            <Text className="text-slate-400 text-[10px] font-medium font-['InclusiveSans']" numberOfLines={1}>
                                Fields: {Object.keys(item).length} • Key: {String(item._id).substring(0, 8)}
                            </Text>
                        </VStack>
                    </HStack>
                    <Box className="bg-[#00796B] p-1.5 rounded-full">
                        <Eye size={12} color="white" />
                    </Box>
                </HStack>
            </Card>
        </TouchableOpacity>
    );

    const renderTableView = () => (
        <ScrollView horizontal className="mb-4">
            <VStack className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                {/* Header Row */}
                <HStack className="bg-[#00473E] p-4 min-w-[750px]">
                    {tableHeaders.map((header, idx) => (
                        <Box 
                            key={idx} 
                            className={`flex-1 px-4 border-r border-[#00695C]/30 ${idx === tableHeaders.length - 1 ? 'border-r-0' : ''}`}
                        >
                            <Text className="text-white font-black text-[10px] uppercase tracking-[0.1em] font-['InclusiveSans'] text-left">{header}</Text>
                        </Box>
                    ))}
                    <Box className="w-16" />
                </HStack>
                {/* Data Rows */}
                {docs.map((doc, dIdx) => (
                    <TouchableOpacity 
                        key={dIdx} 
                        onPress={() => handleEdit(doc)}
                        activeOpacity={0.7}
                    >
                        <Card className={`bg-white rounded-none border-b border-slate-100 p-4 min-w-[750px] flex-row active:bg-teal-50/50 ${dIdx === docs.length - 1 ? 'border-b-0' : ''}`}>
                            {tableHeaders.map((header, hIdx) => (
                                <Box 
                                    key={hIdx} 
                                    className={`flex-1 px-4 border-r border-slate-50 ${hIdx === tableHeaders.length - 1 ? 'border-r-0' : ''}`}
                                >
                                    <Text className="text-[#004D40] text-xs font-['InclusiveSans'] text-left" numberOfLines={1}>
                                        {typeof doc[header] === 'object' ? '{...}' : String(doc[header] || '-')}
                                    </Text>
                                </Box>
                            ))}
                            <TouchableOpacity 
                                className="w-16 items-center justify-center border-l border-slate-50" 
                                onPress={() => handleDelete(doc)}
                            >
                                <Box className="bg-[#FFF1F2] p-1.5 rounded-full">
                                    <Trash2 size={13} color="#F43F5E" />
                                </Box>
                            </TouchableOpacity>
                        </Card>
                    </TouchableOpacity>
                ))}
            </VStack>
        </ScrollView>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F8FBFA]">
            <VStack className="p-6 pt-10" space="lg">
                <HStack className="justify-between items-center">
                    <VStack className="flex-1 mr-4">
                        <HStack space="xs" className="items-center mb-1">
                            <LayoutGrid size={12} color="#94A3B8" />
                            <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans']">Target Namespace</Text>
                        </HStack>
                        <Text className="text-[#004D40] font-black text-3xl font-['InclusiveSans'] tracking-tighter" numberOfLines={1}>{collectionName}</Text>
                    </VStack>
                    <Button 
                        size="xl"
                        className="bg-[#00796B] rounded-2xl shadow-xl shadow-teal-500/30 px-6 h-14"
                        onPress={handleAdd}
                    >
                        <ButtonIcon as={Plus} color="white" />
                        <ButtonText className="font-bold ml-2 font-['InclusiveSans']">Insert</ButtonText>
                    </Button>
                </HStack>

                <HStack className="bg-[#E0F2F1] p-1 rounded-2xl self-center" space="xs">
                    <Button onPress={() => setViewType('json')} className={`rounded-xl px-5 h-10 ${viewType === 'json' ? 'bg-[#00796B]' : 'bg-transparent'}`}>
                        <ButtonIcon as={FileJson} color={viewType === 'json' ? 'white' : '#00796B'} size="sm" />
                        <ButtonText className={`ml-2 font-bold text-xs font-['InclusiveSans'] ${viewType === 'json' ? 'text-white' : 'text-[#00796B]'}`}>JSON</ButtonText>
                    </Button>
                    <Button onPress={() => setViewType('list')} className={`rounded-xl px-5 h-10 ${viewType === 'list' ? 'bg-[#00796B]' : 'bg-transparent'}`}>
                        <ButtonIcon as={List} color={viewType === 'list' ? 'white' : '#00796B'} size="sm" />
                        <ButtonText className={`ml-2 font-bold text-xs font-['InclusiveSans'] ${viewType === 'list' ? 'text-white' : 'text-[#00796B]'}`}>LIST</ButtonText>
                    </Button>
                    <Button onPress={() => setViewType('table')} className={`rounded-xl px-5 h-10 ${viewType === 'table' ? 'bg-[#00796B]' : 'bg-transparent'}`}>
                        <ButtonIcon as={Columns} color={viewType === 'table' ? 'white' : '#00796B'} size="sm" />
                        <ButtonText className={`ml-2 font-bold text-xs font-['InclusiveSans'] ${viewType === 'table' ? 'text-white' : 'text-[#00796B]'}`}>TABLE</ButtonText>
                    </Button>
                </HStack>
            </VStack>
            
            {loading ? (
                <VStack className="flex-1 justify-center items-center">
                    <Spinner size="large" color="#00796B" />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans'] mt-2">Connecting to Instance...</Text>
                </VStack>
            ) : (
                <View className="flex-1 px-6">
                    {viewType === 'table' ? (
                        <FlatList
                            data={[1]}
                            renderItem={renderTableView}
                            contentContainerStyle={{ paddingBottom: 120 }}
                        />
                    ) : (
                        <FlatList
                            data={docs}
                            keyExtractor={(item) => String(item._id || Math.random())}
                            renderItem={viewType === 'json' ? renderJsonItem : renderListItem}
                            contentContainerStyle={{ paddingBottom: 120 }}
                            ListEmptyComponent={
                                <VStack className="items-center mt-20" space="md">
                                    <FileJson size={48} color="#CBD5E1" />
                                    <Text className="text-slate-400 text-sm font-medium font-['InclusiveSans']">Empty storage.</Text>
                                </VStack>
                            }
                        />
                    )}
                </View>
            )}

            <Box className="absolute bottom-0 left-0 right-0 bg-[#F8FBFA]/90 pt-4 pb-10 px-8 border-t border-[#E0F2F1]">
                <HStack className="justify-between items-center">
                    <TouchableOpacity onPress={() => setPage(Math.max(1, page - 1))} className={`bg-white rounded-2xl h-12 w-12 items-center justify-center border border-[#E0F2F1] ${page === 1 ? 'opacity-20' : ''}`}>
                        <ArrowLeft size={20} color="#00796B" />
                    </TouchableOpacity>
                    <VStack className="items-center">
                        <Text className="text-[#004D40] font-black tracking-widest text-xs font-['InclusiveSans']">{page} / {Math.max(1, totalPages)}</Text>
                        <Text className="text-slate-400 text-[8px] font-bold uppercase font-['InclusiveSans']">Navigation Area</Text>
                    </VStack>
                    <TouchableOpacity onPress={() => setPage(Math.min(totalPages, page + 1))} className={`bg-white rounded-2xl h-12 w-12 items-center justify-center border border-[#E0F2F1] ${page >= totalPages ? 'opacity-20' : ''}`}>
                        <ArrowRight size={20} color="#00796B" />
                    </TouchableOpacity>
                </HStack>
            </Box>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="full">
                <ModalBackdrop />
                <ModalContent className="bg-[#F8FBFA] border-t border-[#E0F2F1] rounded-t-[3rem] h-[90%] mt-auto">
                    <ModalHeader className="p-8 pb-4">
                        <VStack space="xs">
                            <Text className="text-[#004D40] font-black text-3xl font-['InclusiveSans'] tracking-tighter">{selectedDoc ? 'Modify Object' : 'Create Object'}</Text>
                            <HStack space="xs" className="items-center">
                                <Terminal size={10} color="#64748B" />
                                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] font-['InclusiveSans']">Native JSON Syntax</Text>
                            </HStack>
                        </VStack>
                        <ModalCloseButton className="bg-[#E1F1F0] rounded-full p-2.5">
                             <X size={20} color="#00796B" />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="p-6">
                        <Box className="bg-white rounded-[2rem] border border-[#E0F2F1] p-6 shadow-inner flex-1">
                            <VStack space="md" className="flex-1">
                                <ScrollView className="flex-1">
                                    <TextInput
                                        className="text-[#00796B] font-mono text-sm leading-7 font-['InclusiveSans']"
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
                    <ModalFooter className="p-6">
                        <Button className="bg-[#00796B] rounded-[1.5rem] h-16 w-full shadow-2xl" onPress={handleSave} disabled={isSaving}>
                            {isSaving ? <Spinner color="white" /> : <ButtonText className="font-extrabold text-xl font-['InclusiveSans']">Deploy Record</ButtonText>}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SafeAreaView>
    );
}
