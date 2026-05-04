import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null); //fetch empty data
    },
    setItem(value: string) {
      return Promise.resolve(value);
    },
    removeItem(value: string) {
      return Promise.resolve();
    },
  };
};
// check if the component is runing in the client(browser) or server and create storage
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();
// data you want to persist on stroge when page reloaded
const persistConfig = { key: "root", storage, whitelist: ["cart", "auth"] };
// combine all reducers into one root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHIDRATE"],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export const useAppDispacth = () => useDispatch<AppDispatch>();
export type IRootState = ReturnType<typeof store.getState>;
