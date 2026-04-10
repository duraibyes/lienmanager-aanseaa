import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { ProfileData } from "../../types/liens";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<
      ApiResponse<ProfileData>,
      void
    >({
      query: () => ({
        url: "/user-profile",
        method: "GET",
      }),
      providesTags: ['Profile'],
    }),
    updatePassword: builder.mutation<
      { message: string; logout: boolean },
      {
        current_password: string;
        password: string;
        password_confirmation: string;
      }
    >({
      query: (data) => ({
        url: "/profile/update-password",
        method: "POST",
        body: data,
      }),
    }),
    updateLienProfile: builder.mutation<
      { message: string, status: boolean },
      FormData
    >({
      query: (data) => ({
        url: "/attorney/profile/update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<
      { message: string, status: boolean },
      FormData
    >({
      query: (data) => ({
        url: "/update/user-profile",
        method: "POST",
        body: data,
      }),
    }),
  })
});

export const {
  useGetProfileQuery,
  useUpdatePasswordMutation,
  useUpdateLienProfileMutation,
  useUpdateProfileMutation
} = profileApi