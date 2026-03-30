import axios from 'axios';

// For local testing on android emulator, it should be 10.0.2.2. For iOS it's localhost.
// Replace with network IP if testing on physical device.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const connectDb = async (uri) => {
    const response = await apiClient.post('/connect', { uri });
    return response.data;
};

export const fetchDatabases = async (uri) => {
    const response = await apiClient.post('/databases', { uri });
    return response.data;
};

export const fetchCollections = async (uri, dbName) => {
    const response = await apiClient.post('/collections', { uri, dbName });
    return response.data;
};

export const fetchDocuments = async (uri, dbName, collectionName, page = 1, limit = 20) => {
    const response = await apiClient.post('/documents', { uri, dbName, collectionName, page, limit });
    return response.data;
};

// CRUD
export const insertDocument = async (uri, dbName, collectionName, document) => {
    const response = await apiClient.post('/insert', { uri, dbName, collectionName, document });
    return response.data;
};

export const updateDocument = async (uri, dbName, collectionName, filter, update) => {
    const response = await apiClient.post('/update', { uri, dbName, collectionName, filter, update });
    return response.data;
};

export const deleteDocument = async (uri, dbName, collectionName, filter) => {
    const response = await apiClient.post('/delete', { uri, dbName, collectionName, filter });
    return response.data;
};
