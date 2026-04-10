// src/features/auth/authApi.ts
import { api } from "../../services/api";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<
            { user: any; token: string, active_projects?: any[] },
            { email: string; password: string }
        >({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data,
            }),
        }),
        signup: builder.mutation<
            { user: any; token: string, active_projects?: any[] },
            { email: string; password: string; password_confirmation: string }
        >({
            query: (data) => ({
                url: "/signup",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useLoginMutation, useSignupMutation } = authApi;