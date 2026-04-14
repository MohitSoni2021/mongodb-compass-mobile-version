# 📱 MongoDB Compass Mobile - Frontend (React Native)

<div align="center">

[![Expo SDK 54](https://img.shields.io/badge/Expo-SDK_54-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)
[![Gluestack UI](https://img.shields.io/badge/Gluestack_UI-v3-6366f1?style=for-the-badge)](https://gluestack.io/)
[![Zustand](https://img.shields.io/badge/Zustand-State-5D4E60?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

**Premium React Native Mobile App for MongoDB Management**

A feature-rich, production-grade mobile application built with Expo SDK 54 for seamless MongoDB cluster exploration and document management on iOS and Android.

</div>

---

## 📌 Overview

The **Frontend** is the user-facing React Native application that provides a beautiful, touch-optimized interface for managing MongoDB clusters. Built with modern React Native best practices, it features a professional design system using Gluestack UI and NativeWind (Tailwind CSS).

### 🎯 Core Responsibilities
- **User Authentication**: Connect to MongoDB instances using connection strings
- **Data Visualization**: Display databases, collections, and documents hierarchically
- **CRUD Operations**: Create, read, update, and delete MongoDB documents
- **Theme Management**: Dark/light mode with system preference detection
- **State Persistence**: Save user connections and preferences locally
- **Network Communication**: Async API calls to backend with error handling

### ✨ Key Features
- **Native-First Design**: Touch-optimized UI built for mobile, not ported from web
- **Premium Typography**: Montserrat headers + Inclusive Sans body text
- **Responsive Layouts**: Perfectly adapts to phones, tablets, and notched devices
- **Offline Support**: Connection state persisted across sessions via Zustand
- **Real-Time Validation**: Immediate feedback on user interactions
- **Hardware Acceleration**: Smooth 60 FPS animations with React Native Reanimated

---

## 📁 Project Structure

```
frontend/
├── 📄 App.tsx                          # Root component & font initialization
├── 📄 index.ts                         # App entry point
├── 📄 global.css                       # Tailwind CSS input file
├── 📄 package.json                     # Dependencies & npm scripts
├── 📄 app.json                         # Expo project configuration
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 tailwind.config.js               # Tailwind design tokens
├── 📄 babel.config.js                  # Babel & module resolver setup
├── 📄 .env                             # Environment variables
├── 📄 nativewind-env.d.ts              # NativeWind TypeScript definitions
├── 📄 metro.config.js                  # Metro bundler configuration
│
├── 📁 src/                             # Source code
│   ├── 📁 screens/                     # Screen-level components
│   │   ├── ConnectScreen.js            # 🔌 Connect to MongoDB
│   │   ├── DatabaseListScreen.js       # 📚 Browse databases
│   │   ├── CollectionListScreen.js     # 📂 Browse collections
│   │   └── DocumentListScreen.js       # 📄 Browse & edit documents
│   │
│   ├── 📁 services/                    # API integration layer
│   │   └── api.js                      # Axios client with interceptors
│   │
│   ├── 📁 store/                       # Zustand state management
│   │   ├── useConnectionStore.js       # 🔗 Connection persistence
│   │   └── useThemeStore.js            # 🎨 Dark/light mode state
│   │
│   └── 📁 navigation/                  # Navigation setup
│       └── AppNavigator.js             # Stack navigator configuration
│
├── 📁 components/                      # Reusable UI components
│   └── 📁 ui/                          # Gluestack UI wrappers
│       ├── box/                        # Container component
│       │   ├── index.tsx               # Native version
│       │   ├── index.web.tsx           # Web version
│       │   └── styles.tsx              # Tailwind styles
│       ├── button/                     # Action buttons
│       ├── card/                       # Card containers
│       ├── divider/                    # Separator lines
│       ├── hstack/                     # Horizontal layout
│       ├── vstack/                     # Vertical layout
│       ├── input/                      # Text input fields
│       ├── text/                       # Typography
│       ├── icon/                       # Icon wrapper
│       ├── modal/                      # Dialog modals
│       ├── spinner/                    # Loading indicators
│       ├── toast/                      # Toast notifications
│       └── gluestack-ui-provider/      # Theme provider
│
├── 📁 assets/                          # App assets (images, icons)
│
├── 📁 android/                         # Native Android configuration
│   ├── 📁 app/                         # App module
│   ├── 📁 build/                       # Build artifacts
│   └── settings.gradle                 # Gradle configuration
│
└── 📄 README.md                        # This file
```

---

## 🛠️ Technology Stack

### Core Framework
| Package | Version | Purpose |
|---------|---------|---------|
| **Expo** | ~54.0.33 | Development & build framework |
| **React Native** | 0.81.5 | Native mobile framework |
| **React** | 19.1.0 | UI library |
| **TypeScript** | ~5.9.2 | Type-safe JavaScript |

### Styling & UI
| Package | Version | Purpose |
|---------|---------|---------|
| **NativeWind** | ^4.2.3 | Tailwind CSS for React Native |
| **Tailwind CSS** | ^3.4.19 | Utility-first CSS framework |
| **Gluestack UI** | ^3.0.16+ | Accessible UI components |
| **Lucide React Native** | ^1.7.0 | Beautiful icon library |
| **Tailwind Variants** | ^0.1.20 | Variant composition |

### State Management & Navigation
| Package | Version | Purpose |
|---------|---------|---------|
| **Zustand** | ^5.0.12 | Lightweight state management |
| **React Navigation** | ^7.2.2 | Native stack navigation |
| **Async Storage** | 2.2.0 | Persistent local storage |

### Networking & Animations
| Package | Version | Purpose |
|---------|---------|---------|
| **Axios** | ^1.14.0 | Promise-based HTTP client |
| **React Native Reanimated** | ~4.1.0 | Hardware-accelerated animations |
| **Legend Motion** | ^2.5.3 | Animation library |

### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| **Expo Fonts** | ~14.0.11 | Font loading |
| **Safe Area Context** | ~5.6.0 | Safe area handling |
| **React Aria** | ^3.47.0 | Accessibility utilities |

---

## 🚀 Quick Start

### Prerequisites
```bash
# Check versions
node --version        # v18.0.0+
npm --version         # v9.0.0+
```

### Installation

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
EXPO_PUBLIC_API_URL=http://127.0.0.1:3000/api
EXPO_APP_VERSION=1.0.0
EXPO_PUBLIC_ENV=development
EOF

# Start development server
npm start
```

### Running the App

**Option 1: Expo Go (Quickest)**
```bash
npm start

# Scan QR code with Expo Go app
# Or press 'a' for Android, 'i' for iOS
```

**Option 2: Android Emulator**
```bash
npm run android

# Or with cache clearing
npm start -- --clear
npm run android
```

**Option 3: iOS Simulator (macOS only)**
```bash
npm run ios
```

**Option 4: Web (Development)**
```bash
npm start --web

# Note: Some mobile-specific features won't work
```

---

## 📱 Screen Components

### 1. **ConnectScreen.js** 🔌
The entry point where users configure MongoDB connections.

**Location**: `src/screens/ConnectScreen.js`

**Features:**
- ✅ Input MongoDB connection string (standard or SRV)
- ✅ Save multiple connections for quick access
- ✅ Validate connection before proceeding
- ✅ Display connection history with delete option
- ✅ Theme toggle (dark/light mode)
- ✅ Real-time connection indicators

**State Used:**
- `useConnectionStore` - Store/retrieve saved connections
- `useThemeStore` - Theme preference

**Data Flow:**
```
User Input
    ↓
validateConnection()
    ↓
connectDb(uri) [API call]
    ↓
Store in Zustand
    ↓
Navigate to Databases
```

**Key Functions:**
```javascript
handleConnect(uri, name)    // Connect and save
removeConnection(uri)       // Delete saved connection
toggleTheme()              // Switch dark/light mode
```

---

### 2. **DatabaseListScreen.js** 📚
Browse all databases in the connected cluster.

**Location**: `src/screens/DatabaseListScreen.js`

**Features:**
- ✅ Fetch and list all databases
- ✅ Display database size and document count
- ✅ Pull-to-refresh functionality
- ✅ Tap to explore collections
- ✅ Loading states with spinner
- ✅ Error handling with retry

**State Used:**
- `useConnectionStore` - Get active MongoDB URI
- Component state - Databases array, loading flag

**Data Flow:**
```
Screen Mounts
    ↓
Fetch databases from API
    ↓
Update local state
    ↓
Render FlatList
    ↓
User taps database
    ↓
Navigate to Collections with dbName param
```

**API Call:**
```javascript
GET /api/databases
Body: { uri: "mongodb://..." }
```

---

### 3. **CollectionListScreen.js** 📂
Browse collections within a selected database.

**Location**: `src/screens/CollectionListScreen.js`

**Features:**
- ✅ List collections in selected database
- ✅ Show collection size & document count
- ✅ Pull-to-refresh
- ✅ Tap to view documents
- ✅ Navigation breadcrumb (Database > Collections)
- ✅ Error states

**Props (Route Params):**
```javascript
route.params.dbName    // Database name
```

**Data Flow:**
```
Route Params (dbName)
    ↓
Fetch collections for dbName
    ↓
Display FlatList
    ↓
User taps collection
    ↓
Navigate to Documents with collectionName
```

**API Call:**
```javascript
POST /api/collections
Body: { 
  uri: "...",
  dbName: "mydb"
}
```

---

### 4. **DocumentListScreen.js** 📄
Browse, create, update, and delete documents.

**Location**: `src/screens/DocumentListScreen.js`

**Features:**
- ✅ List documents with infinite pagination
- ✅ View document details in JSON format
- ✅ Create new documents via modal
- ✅ Edit existing documents
- ✅ Delete documents with confirmation
- ✅ Pull-to-refresh
- ✅ Search/filter (roadmap)

**Props (Route Params):**
```javascript
route.params.dbName          // Database name
route.params.collectionName  // Collection name
```

**CRUD Operations:**

**Create (Modal)**
```javascript
const newDoc = { name: "John", email: "john@example.com" };
POST /api/insert
Body: {
  uri: "...",
  dbName: "mydb",
  collectionName: "users",
  document: newDoc
}
```

**Update (Inline Edit)**
```javascript
const updates = { name: "Jane" };
POST /api/update
Body: {
  uri: "...",
  dbName: "mydb",
  collectionName: "users",
  filter: { _id: "..." },
  update: { $set: updates }
}
```

**Delete (Confirm Dialog)**
```javascript
POST /api/delete
Body: {
  uri: "...",
  dbName: "mydb",
  collectionName: "users",
  filter: { _id: "..." }
}
```

---

## 🧠 State Management with Zustand

### **useConnectionStore.js**
Manages MongoDB connection state and saves connections locally.

**Store Shape:**
```javascript
{
  // Active connection
  activeUri: "mongodb://localhost:27017",
  
  // Saved connections
  connections: [
    { uri: "mongodb://...", name: "Local" },
    { uri: "mongodb+srv://...", name: "Production" }
  ],
  
  // Methods
  setActiveUri(uri),
  addConnection({ uri, name }),
  removeConnection(uri),
  clearConnections()
}
```

**Usage in Components:**
```javascript
import { useConnectionStore } from '../store/useConnectionStore';

function MyComponent() {
  const activeUri = useConnectionStore(state => state.activeUri);
  const connections = useConnectionStore(state => state.connections);
  const setActiveUri = useConnectionStore(state => state.setActiveUri);
  
  return (
    <Text>{activeUri}</Text>
  );
}
```

**Persistence:**
```javascript
// Zustand automatically syncs with AsyncStorage
// Connections persist across app restarts
```

---

### **useThemeStore.js**
Manages dark/light theme preference.

**Store Shape:**
```javascript
{
  // Theme preference
  isDark: false,
  
  // Methods
  toggleTheme(),
  setTheme(isDark)
}
```

**Usage in Components:**
```javascript
import { useThemeStore } from '../store/useThemeStore';

function ThemedComponent() {
  const isDark = useThemeStore(state => state.isDark);
  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  
  return (
    <Box className={bgColor}>
      {/* Content */}
    </Box>
  );
}
```

**Theme Implementation:**
```javascript
// Colors change based on isDark flag
const bgColor = isDark ? 'bg-[#0f172a]' : 'bg-[#FAF9F6]';
const textColor = isDark ? 'text-[#f8fafc]' : 'text-[#1e293b]';
```

---

## 🌐 API Service Layer

### **src/services/api.js**
Centralized Axios instance for all backend communication.

**Configuration:**
```javascript
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptors for logging, token injection, etc.
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    throw error;
  }
);

export default api;
```

**API Functions:**
```javascript
// Connection
export const connectDb = (uri) => 
  api.post('/connect', { uri });

// Fetch databases
export const getDatabases = (uri) => 
  api.post('/databases', { uri });

// Fetch collections
export const getCollections = (uri, dbName) => 
  api.post('/collections', { uri, dbName });

// Fetch documents
export const getDocuments = (uri, dbName, collectionName, page) => 
  api.post('/documents', { uri, dbName, collectionName, page });

// CRUD
export const insertDocument = (uri, dbName, collectionName, document) =>
  api.post('/insert', { uri, dbName, collectionName, document });

export const updateDocument = (uri, dbName, collectionName, filter, update) =>
  api.post('/update', { uri, dbName, collectionName, filter, update });

export const deleteDocument = (uri, dbName, collectionName, filter) =>
  api.post('/delete', { uri, dbName, collectionName, filter });
```

**Usage in Components:**
```javascript
import { connectDb, getDatabases } from '../services/api';

async function loadDatabases() {
  try {
    const response = await getDatabases(activeUri);
    setDatabases(response.data.databases);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
}
```

---

## 🧭 Navigation Structure

### **src/navigation/AppNavigator.js**
React Navigation stack configuration.

**Stack Structure:**
```
AppNavigator
  ├── Connect (Initial)
  ├── Databases
  ├── Collections
  └── Documents
```

**Navigation Flow:**
```
Connect Screen
    ↓ [tap Connect]
Databases Screen (dbName param)
    ↓ [tap Database]
Collections Screen (collectionName param)
    ↓ [tap Collection]
Documents Screen
```

**Navigation Usage:**
```javascript
import { useNavigation } from '@react-navigation/native';

function MyComponent() {
  const navigation = useNavigation();
  
  const navigateToDatabases = () => {
    navigation.navigate('Databases');
  };
  
  const navigateToCollections = (dbName) => {
    navigation.navigate('Collections', { dbName });
  };
}
```

---

## 🎨 UI Components

All components are built with **Gluestack UI v3** and styled with **NativeWind (Tailwind CSS)**.

### Available Components

**Containers**
- `<Box>` - Basic container with Tailwind styling
- `<VStack>` - Vertical stack (flex column)
- `<HStack>` - Horizontal stack (flex row)
- `<Card>` - Elevated card component

**Input**
- `<Input>` - Text input field
- `<Button>` - Action button with icon support
- `<TextInput>` - Native text input

**Typography**
- `<Text>` - Text component with Montserrat/Inclusive Sans
- Various heading sizes

**Feedback**
- `<Spinner>` - Loading indicator
- `<Toast>` - Toast notifications
- `<Modal>` - Dialog modal

**Navigation**
- `<Icon>` - Lucide React Native icons
- `<Divider>` - Separator line

### Example Component Usage

```javascript
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Database } from 'lucide-react-native';

export default function DatabaseCard({ db }) {
  return (
    <Card className="mb-3 bg-white dark:bg-slate-800 p-4 rounded-lg">
      <HStack className="items-center justify-between">
        <HStack className="flex-1">
          <Icon as={Database} size="lg" className="text-blue-600" />
          <VStack className="ml-3 flex-1">
            <Text className="font-bold text-slate-900 dark:text-white">
              {db.name}
            </Text>
            <Text className="text-sm text-slate-600 dark:text-slate-400">
              {(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB
            </Text>
          </VStack>
        </HStack>
        <ButtonIcon as={ChevronRight} className="text-slate-400" />
      </HStack>
    </Card>
  );
}
```

---

## 🎯 Styling with NativeWind & Tailwind

### Tailwind Classes in React Native

```javascript
// Works just like web Tailwind!
<Box className="bg-blue-500 p-4 rounded-lg shadow-lg">
  <Text className="text-white font-bold text-lg">
    Hello NativeWind!
  </Text>
</Box>
```

### Dark Mode Support

```javascript
// Automatically switches with system preference
<Box className="bg-white dark:bg-slate-800">
  <Text className="text-slate-900 dark:text-white">
    Adaptive color
  </Text>
</Box>
```

### Responsive Design

```javascript
// Mobile first (applies on all sizes, then larger devices)
<Box className="w-full md:w-1/2 lg:w-1/3">
  Responsive layout
</Box>
```

### Custom Colors in tailwind.config.js

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#006BFF',
          600: '#0055CC',
        },
      },
    },
  },
};
```

---

## ⚙️ Configuration Files

### **tsconfig.json** - TypeScript Configuration
```json
{
  "extends": "expo/tsconfig",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Features:**
- Strict type checking enabled
- Module path aliases (@/components)
- Expo TypeScript presets

---

### **app.json** - Expo Configuration
```json
{
  "expo": {
    "name": "MongoDB Compass Mobile",
    "slug": "mongodb-mobile",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "plugins": [
      ["expo-font"]
    ]
  }
}
```

**Key Settings:**
- App name and slug
- Supported platforms
- Font loading plugin

---

### **tailwind.config.js** - Design System
```javascript
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{tsx,ts}',
    './components/**/*.{tsx,ts}',
    './src/**/*.{tsx,ts}'
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: { /* ... */ },
      fontFamily: {
        heading: ['Montserrat'],
        body: ['InclusiveSans']
      }
    }
  }
};
```

---

### **babel.config.js** - Module Aliases
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          '@': './'
        }
      }]
    ]
  };
};
```

**Enables:**
- `import { Box } from '@/components/ui/box'`
- Instead of `import { Box } from '../../../components/ui/box'`

---

## 🔐 Security Best Practices

### 1. **Environment Variables**
```bash
# ✅ Safe: Use .env
EXPO_PUBLIC_API_URL=http://127.0.0.1:3000/api

# ❌ Dangerous: Hardcode in code
const API_URL = "http://localhost:3000/api";
```

### 2. **Connection String Handling**
```javascript
// ✅ Ask user to input
<TextInput 
  placeholder="mongodb://user:pass@host"
  secureTextEntry
  onChangeText={setUri}
/>

// ❌ Don't store in local code/comments
```

### 3. **Error Messages**
```javascript
// ✅ Generic message to user
Alert.alert('Error', 'Failed to connect');

// ❌ Expose technical details
console.error(error.message); // Don't show to user
```

### 4. **API Security**
```javascript
// ✅ HTTPS in production
const API_URL = "https://api.yourdomain.com";

// ❌ HTTP exposes credentials
const API_URL = "http://api.yourdomain.com";
```

---

## 📊 Performance Optimization

### 1. **Image Optimization**
```javascript
// ✅ Optimize large images
<Image 
  source={require('./icon.png')}
  resizeMode="contain"
  style={{ width: 100, height: 100 }}
/>

// ❌ Large unoptimized images
```

### 2. **List Performance**
```javascript
// ✅ Use FlatList with keyExtractor
<FlatList
  data={documents}
  keyExtractor={item => item._id}
  renderItem={({ item }) => <DocumentCard doc={item} />}
  scrollEventThrottle={16}
/>

// ❌ ScrollView with large lists (causes jank)
```

### 3. **Re-render Prevention**
```javascript
// ✅ Memoize components
const DatabaseCard = React.memo(({ db }) => (
  <Card>{db.name}</Card>
));

// ❌ Inline functions cause re-renders
const card = () => <Card>{db.name}</Card>;
```

---

## 🧪 Testing

Currently, no test framework is configured. To add testing:

```bash
# Install Jest & React Native Testing Library
npm install --save-dev jest @testing-library/react-native

# Create test file
touch src/screens/__tests__/ConnectScreen.test.tsx
```

**Example Test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react-native';
import ConnectScreen from '../ConnectScreen';

describe('ConnectScreen', () => {
  it('renders Connect button', () => {
    render(<ConnectScreen />);
    const button = screen.getByText('Connect');
    expect(button).toBeTruthy();
  });
});
```

---

## 🚀 Building for Release

### Android Release APK

```bash
cd frontend

# Build release APK
eas build --platform android --profile release

# Or locally
cd android
./gradlew assembleRelease
cd ..

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### iOS Release Build

```bash
# Requires Apple Developer account & Xcode
eas build --platform ios --profile release

# Or locally
cd ios
xcodebuild -workspace MongoDB.xcworkspace \
  -scheme MongoDB \
  -configuration Release
cd ..
```

---

## 📝 npm Scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Start Expo dev server |
| `npm run android` | Build & run on Android |
| `npm run ios` | Build & run on iOS |
| `npm run web` | Run web preview |
| `npm install` | Install dependencies |
| `npm test` | Run tests (if configured) |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Blank screen on startup** | Clear cache: `npm start -- --clear` |
| **Cannot connect to backend** | Verify `EXPO_PUBLIC_API_URL` in `.env` |
| **Fonts not loading** | Check `expo-font` plugin in `app.json` |
| **Dark mode not switching** | Ensure `useThemeStore` is properly imported |
| **Slow animations** | Reduce animation duration or use Reanimated |
| **Build fails with TypeScript** | Run `npm install` and ensure `tsconfig.json` is correct |

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Gluestack UI Components](https://gluestack.io/ui/docs/components)
- [NativeWind Reference](https://www.nativewind.dev/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Navigation Guide](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Support

For issues or questions:
- Check the [main README](../README.md)
- Review [backend documentation](../backend/README.md)
- Check [features documentation](../features.md)
- Open an issue on GitHub
- Contact: [Mohit Soni](https://github.com/mohitsoni)

---

**⭐ Developed by Mohit Soni | MongoDB Compass Mobile Frontend**
