import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { CalculatedDeadlineResponse, DeadLineRequestType } from "../../types/deadline";

export const DeadlineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* ---------- Deadline calculation ---------- */
    calculateDeadline: builder.mutation<
      ApiResponse<CalculatedDeadlineResponse>,
      DeadLineRequestType
    >({
      query: (body) => ({
        url: "/deadline-info",
        method: "POST",
        body,
      }),
    }),

    getAllDeadlines: builder.query<ApiResponse<any[]>, string | null | void>({
      query: (projectId?: string | null) => ({
        url: '/deadlines',
        params: projectId ? { projectId } : {}
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useCalculateDeadlineMutation,
  useGetAllDeadlinesQuery,
} = DeadlineApi;