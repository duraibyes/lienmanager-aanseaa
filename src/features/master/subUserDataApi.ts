import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { CommonData } from "../../types/master";
import { SubUser } from "../../types/user";

export const subUserDataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubUsers: builder.query<ApiResponse<CommonData[]>, void>({
      query: () => "/sub-users-all",
      keepUnusedDataFor: 3600,
      providesTags: ['SubUsers'],
    }),

    submitSubUser: builder.mutation<
      ApiResponse<CommonData>,
      SubUser
    >({
      query: (body) => ({
        url: "/sub-users",
        method: "POST",
        body,
      }),
      invalidatesTags: ['SubUsers'],
    }),

  }),
});

export const {
  useSubmitSubUserMutation,
  useGetSubUsersQuery
} = subUserDataApi;