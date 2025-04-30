import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// import storage from 'redux-persist/es/lib/storage.js'; // Sử dụng localStorage
import userReducer from "./slices/userSlice.js"; // Đường dẫn đến file userSlice.js
import sessionStorage from 'redux-persist/es/storage/session.js';

const persistConfig = {
	key: 'root',
	storage: sessionStorage
}

const persistedReducer = persistReducer(persistConfig, userReducer); 

const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };