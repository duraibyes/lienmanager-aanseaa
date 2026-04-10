import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    name: string;
    email: string;
    role: number;
    image?: string;
    lien: {
        id: number;
        role_name: string;
    }
}

interface AuthState {
    user: User | null;
    token: string | null;
    active_projects?: any[];
}

const storedAuth = localStorage.getItem("auth");

const initialState: AuthState = storedAuth
    ? JSON.parse(storedAuth)
    : {
        user: null,
        token: null,
        active_projects: [],
    };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string, active_projects?: any[] }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.active_projects = action.payload.active_projects || [];
            localStorage.setItem(
                "auth",
                JSON.stringify({
                    user: action.payload.user,
                    token: action.payload.token,
                    active_projects: action.payload.active_projects || [],
                })
            );
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.active_projects = [];
            localStorage.removeItem("auth");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
