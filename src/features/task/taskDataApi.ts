import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { CommonData } from "../../types/master";
import { ProjectListRequest } from "../../types/project";
import { TaskCountResponse } from "../../types/tasks";

export const taskDataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTaskActions: builder.query<ApiResponse<CommonData[]>, void>({
      query: () => "/task-actions",
      // keepUnusedDataFor: 3600,
    }),
    getTaskStatusCount: builder.query<
      ApiResponse<TaskCountResponse>,
      void
    >({
      query: () => ({
        url: "/tasks/count",
        method: "GET",
      }),
    }),
    getTasks: builder.query<
      ApiResponse<any>,
      ProjectListRequest
    >({
      query: (params) => ({
        url: "/tasks",
        method: "GET",
        params,
      }),
    }),
    getTaskById: builder.query<any, number>({
      query: (id) => `/tasks/${id}`,
    }),

  }),
});

export const {
  useGetTaskActionsQuery,
  useGetTaskStatusCountQuery,
  useGetTasksQuery,
  useGetTaskByIdQuery
} = taskDataApi;