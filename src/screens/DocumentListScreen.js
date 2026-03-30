import React, { useEffect, useState } from 'react';
import { FlatList, Alert, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useConnectionStore } from '../store/useConnectionStore';
import { fetchDocuments, insertDocument, updateDocument, deleteDocument } from '../services/api';
import { FileJson, Edit2, Trash2, Plus, X, ArrowLeft, ArrowRight, Save, LayoutGrid } from 'lucide-react-native';

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
            'Are you sure you want to delete this document?',
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
        <Card className="bg-slate-900/60 p-5 rounded-3xl mb-5 border border-slate-800/80 shadow-md">
            <HStack className="justify-between items-center mb-4 pb-3 border-b border-slate-800/50">
                <HStack space="sm" className="items-center">
                    <Box className="bg-violet-500/20 p-2 rounded-lg">
                        <FileJson size={14} color="#a78bfa" />
                    </Box>
                    <Text className="text-violet-400 font-black text-[10px] uppercase tracking-widest">BSON Object</Text>
                </HStack>
                <HStack space="xs">
                    <Button variant="link" className="p-2 h-auto w-auto bg-slate-800/50 rounded-xl" onPress={() => handleEdit(item)}>
                        <ButtonIcon as={Edit2} size="sm" color="#38bdf8" />
                    </Button>
                    <Button variant="link" className="p-2 h-auto w-auto bg-slate-800/50 rounded-xl" onPress={() => handleDelete(item)}>
                        <ButtonIcon as={Trash2} size="sm" color="#f43f5e" />
                    </Button>
                </HStack>
            </HStack>
            <Box className="bg-slate-950/80 p-4 rounded-2xl border border-slate-900 shadow-inner">
                <Text className="text-emerald-400 font-mono text-[11px] leading-5">
                    {JSON.stringify(item, null, 2)}
                </Text>
            </Box>
        </Card>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <VStack className="p-5 border-b border-slate-900" space="md">
                <HStack className="justify-between items-center">
                    <VStack className="flex-1 mr-4">
                        <HStack space="xs" className="items-center mb-1">
                            <LayoutGrid size={14} color="#64748b" />
                            <Text className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Collection Scope</Text>
                        </HStack>
                        <Text className="text-white font-black text-2xl truncate" numberOfLines={1}>{collectionName}</Text>
                        <Text className="text-slate-500 text-[10px] font-medium mt-1">
                            Displaying {docs.length} assets • Page {page} of {Math.max(1, totalPages)}
                        </Text>
                    </VStack>
                    <Button 
                        size="md"
                        className="bg-violet-600 rounded-2xl shadow-lg shadow-violet-600/20 px-6 h-12"
                        onPress={handleAdd}
                    >
                        <ButtonIcon as={Plus} color="white" />
                        <ButtonText className="font-bold ml-2">Insert</ButtonText>
                    </Button>
                </HStack>
            </VStack>
            
            {loading ? (
                <VStack className="flex-1 justify-center items-center">
                    <Spinner size="large" color="#8b5cf6" />
                </VStack>
            ) : (
                <FlatList
                    data={docs}
                    keyExtractor={(item) => String(item._id || Math.random())}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={
                        <VStack className="items-center mt-20" space="md">
                            <FileJson size={48} color="#1e293b" />
                            <Text className="text-slate-500 text-sm font-medium">Empty collection</Text>
                        </VStack>
                    }
                />
            )}

            {/* Pagination Controls */}
            <HStack className="justify-between items-center p-6 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
                <Button 
                    variant="solid"
                    className={`bg-slate-900 rounded-xl h-12 px-4 shadow-sm ${page === 1 ? 'opacity-20' : ''}`}
                    onPress={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                >
                    <ButtonIcon as={ArrowLeft} color="white" />
                </Button>
                <Text className="text-white font-black tracking-widest text-xs">{page} / {Math.max(1, totalPages)}</Text>
                <Button 
                    variant="solid"
                    className={`bg-slate-900 rounded-xl h-12 px-4 shadow-sm ${page >= totalPages ? 'opacity-20' : ''}`}
                    onPress={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                >
                    <ButtonIcon as={ArrowRight} color="white" />
                </Button>
            </HStack>

            {/* Editor Modal */}
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="lg">
                <ModalBackdrop />
                <ModalContent className="bg-slate-900 border-t border-slate-800 rounded-t-[2.5rem] h-[85%] mt-auto">
                    <ModalHeader className="p-6 border-b border-slate-800/50">
                        <VStack space="xs">
                            <Text className="text-white font-black text-2xl tracking-tighter">
                                {selectedDoc ? 'Modify Document' : 'Initialize Document'}
                            </Text>
                            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Native JSON Syntax</Text>
                        </VStack>
                        <ModalCloseButton className="bg-slate-800 rounded-full p-2">
                             <Box className="items-center justify-center p-1">
                                <X size={20} color="white" />
                             </Box>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody className="p-4">
                        <ScrollView className="bg-slate-950 rounded-3xl border border-slate-800 p-4">
                            <TextInput
                                className="text-emerald-400 font-mono text-sm leading-6"
                                multiline
                                textAlignVertical="top"
                                value={jsonInput}
                                onChangeText={setJsonInput}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholderTextColor="#334155"
                            />
                        </ScrollView>
                    </ModalBody>
                    <ModalFooter className="p-6 border-t border-slate-800/50">
                        <Button 
                            className="bg-violet-600 rounded-2xl h-14 w-full shadow-xl shadow-violet-600/30"
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Spinner color="white" />
                            ) : (
                                <HStack space="sm" className="items-center">
                                    <ButtonIcon as={Save} color="white" />
                                    <ButtonText className="font-bold text-lg">Push to Collection</ButtonText>
                                </HStack>
                            )}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </SafeAreaView>
    );
}
