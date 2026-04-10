// src/features/auth/authApi.ts
import { api } from "../../services/api";

export const leinAuthApi = api.injectEndpoints({
    endpoints: (builder) => ({
        lienSignup: builder.mutation<
            { user: any; token: string, active_projects?: any[] },
            FormData
        >({
            query: (data) => ({
                url: "/attorney/signup",
                method: "POST",
                body: data,
            }),
        }),
    }),
});


export const { useLienSignupMutation } = leinAuthApi;
