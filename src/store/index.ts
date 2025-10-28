import { configureStore } from "@reduxjs/toolkit";
import useAuthReducer from "./useAuthStore";

const store = configureStore({
    reducer: {
        useAuthStore: useAuthReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
