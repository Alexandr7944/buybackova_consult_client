import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export type User = {
    username: string,
    roles: Array<string>,
    profiles: Array<{
        provider: string,
        providerUserId: string,
        displayName: string,
    }>
};

type UserState = {
    user?: User;
    isAuth: boolean,
    isLoading: boolean;
    error?: string | null;
} | undefined;

const initialState: UserState = {
    user:      undefined,
    isAuth:    false,
    isLoading: false,
    error:     null,
};

const useAuthSlice = createSlice({
    name:     "useAuthStore",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | undefined>) {
            state.user = action.payload;
            state.isAuth = true;
            state.isLoading = false;
            state.error = null;
        },

        logout(state) {
            state.user = undefined;
            state.isAuth = false;
            state.isLoading = false;
            state.error = null;
        },
    },
});

export const {setUser, logout} = useAuthSlice.actions;

export default useAuthSlice.reducer;

