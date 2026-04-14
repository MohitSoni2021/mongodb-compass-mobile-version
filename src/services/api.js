import axios from 'axios';

// Fallback to localhost if EXPO_PUBLIC_API_URL is missing. 
// Note: 10.0.2.2 is only for Android Emulators. 
// For production/physical devices, you MUST provide the server IP in .env
const API_URL = "https://mongodb-compass-mobile-version-backend.onrender.com/api" || 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10s timeout to prevent hanging
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to simplify error handling on screens
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let msg = 'An unexpected error occurred.';
        if (error.code === 'ECONNABORTED') msg = 'Request timed out. Server may be slow.';
        else if (!error.response) msg = 'Network error. Server unreachable.';
        else if (error.response.data && error.response.data.error) msg = error.response.data.error;
        else if (error.response.data && typeof error.response.data === 'string') msg = error.response.data;
        
        return Promise.reject({ error: msg, message: msg });
    }
);

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
