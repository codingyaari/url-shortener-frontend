import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';
import linksReducer from './slices/linksSlice';
import analyticsReducer from './slices/analyticsSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['links'], // Only persist links data, not analytics
};

// Combine reducers
const rootReducer = combineReducers({
  links: linksReducer,
  analytics: analyticsReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

