import React, { useEffect, useState } from 'react';
import { FlatList, Alert, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchDocuments, insertDocument, updateDocument, deleteDocument } from '../services/api';
import { FileJson, Edit2, Trash2, Plus, X, ArrowLeft, ArrowRight, Save, LayoutGrid, Database, Terminal } from 'lucide-react-native';

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
        setJsonInput('{\n  \n}');
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

    const renderItem = ({ item }) => (
        <Card className="bg-white p-5 rounded-[2.5rem] mb-6 border border-[#E0F2F1] shadow-xl shadow-teal-900/5 overflow-hidden">
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
                    <Button variant="link" className="p-2 h-auto w-auto bg-slate-50 rounded-xl" onPress={() => handleEdit(item)}>
                        <ButtonIcon as={Edit2} size="sm" color="#00796B" />
                    </Button>
                    <Button variant="link" className="p-2 h-auto w-auto bg-slate-50 rounded-xl" onPress={() => handleDelete(item)}>
                        <ButtonIcon as={Trash2} size="sm" color="#F43F5E" />
                    </Button>
                </HStack>
            </HStack>
            <Box className="bg-[#F8FBFA] p-5 rounded-2xl border border-slate-100 shadow-inner">
                <Text className="text-[#004D40] font-mono text-[11px] leading-6">
                    {JSON.stringify(item, null, 2)}
                </Text>
            </Box>
        </Card>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F8FBFA]">
            <VStack className="p-6 pt-10" space="lg">
                <HStack className="justify-between items-center">
                    <VStack className="flex-1 mr-4">
                        <HStack space="xs" className="items-center mb-1">
                            <LayoutGrid size={12} color="#94A3B8" />
                            <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans']">Target Collection</Text>
                        </HStack>
                        <Text className="text-[#004D40] font-black text-3xl font-['InclusiveSans'] tracking-tighter" numberOfLines={1}>{collectionName}</Text>
                        <Box className="bg-[#E0F2F1] mt-2 self-start px-2 py-0.5 rounded-md">
                            <Text className="text-[#00796B] text-[9px] font-bold font-['InclusiveSans'] uppercase tracking-widest">
                                Page {page} of {Math.max(1, totalPages)} • {docs.length} Items Local
                            </Text>
                        </Box>
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
                <Divider className="bg-[#E0F2F1]" />
            </VStack>
            
            {loading ? (
                <VStack className="flex-1 justify-center items-center">
                    <Spinner size="large" color="#00796B" />
                    <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-['InclusiveSans'] mt-2">Querying Engine...</Text>
                </VStack>
            ) : (
                <FlatList
                    data={docs}
                    keyExtractor={(item) => String(item._id || Math.random())}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                    ListEmptyComponent={
                        <VStack className="items-center mt-20" space="md">
                            <FileJson size={48} color="#CBD5E1" />
                            <Text className="text-slate-400 text-sm font-medium font-['InclusiveSans']">No documents in this scope.</Text>
                        </VStack>
                    }
                />
            )}

            {/* Pagination Controls */}
            <Box className="absolute bottom-0 left-0 right-0 bg-[#F8FBFA]/90 pt-4 pb-10 px-8 border-t border-[#E0F2F1]">
                <HStack className="justify-between items-center">
                    <Button 
                        onPress={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        variant="link"
                        className={`bg-white rounded-2xl h-12 w-12 items-center justify-center border border-[#E0F2F1] shadow-sm ${page === 1 ? 'opacity-20' : ''}`}
                    >
                        <ButtonIcon as={ArrowLeft} color="#00796B" size="md" />
                    </Button>
                    
                    <VStack className="items-center">
                        <Text className="text-[#004D40] font-black tracking-widest text-xs font-['InclusiveSans']">{page} / {Math.max(1, totalPages)}</Text>
                        <Text className="text-slate-400 text-[8px] font-bold uppercase font-['InclusiveSans']">Navigation Hub</Text>
                    </VStack>

                    <Button 
                        onPress={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages}
                        variant="link"
                        className={`bg-white rounded-2xl h-12 w-12 items-center justify-center border border-[#E0F2F1] shadow-sm ${page >= totalPages ? 'opacity-20' : ''}`}
                    >
                        <ButtonIcon as={ArrowRight} color="#00796B" size="md" />
                    </Button>
                </HStack>
            </Box>

            {/* Editor Modal */}
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="full">
                <ModalBackdrop />
                <ModalContent className="bg-[#F8FBFA] border-t border-[#E0F2F1] rounded-t-[3rem] h-[90%] mt-auto shadow-2xl">
                    <ModalHeader className="p-8 pb-4">
                        <VStack space="xs">
                            <Text className="text-[#004D40] font-black text-3xl font-['InclusiveSans'] tracking-tighter">
                                {selectedDoc ? 'Modify Object' : 'Create Object'}
                            </Text>
                            <HStack space="xs" className="items-center">
                                <Terminal size={10} color="#64748B" />
                                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] font-['InclusiveSans']">Native JSON Syntax</Text>
                            </HStack>
                        </VStack>
                        <ModalCloseButton className="bg-[#E1F1F0] rounded-full p-2.5 active:bg-[#B2DFDB]">
                             <Box className="items-center justify-center h-6 w-6">
                                <X size={20} color="#00796B" />
                             </Box>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="p-6">
                        <Box className="bg-white rounded-[2rem] border border-[#E0F2F1] p-6 shadow-inner flex-1">
                            <VStack space="md" className="flex-1">
                                <ScrollView className="flex-1">
                                    <TextInput
                                        className="text-[#00796B] font-mono text-sm leading-7"
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
                    <ModalFooter className="p-8 pt-2">
                        <Button 
                            className="bg-[#00796B] rounded-[1.5rem] h-16 w-full shadow-2xl shadow-teal-500/40"
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Spinner color="white" />
                            ) : (
                                <HStack space="sm" className="items-center">
                                    <ButtonIcon as={Save} color="white" size="md" />
                                    <ButtonText className="font-extrabold text-xl font-['InclusiveSans'] tracking-tight">Deploy to Collection</ButtonText>
                                </HStack>
                            )}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SafeAreaView>
    );
}
