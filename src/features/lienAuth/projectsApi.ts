import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { ProjectListRequest } from "../../types/project";

export const projectLienApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLienProjects: builder.query<
          ApiResponse<any>,
          ProjectListRequest
        >({
          query: (params) => ({
            url: "/attorney/projects",
            method: "GET",
            params,
          }),
        }),

        getLienProjectContractCalculation: builder.query<
          ApiResponse<any>,
          void
        >({
          query: () => ({
            url: "/attorney/total-contracts",
            method: "GET",
          }),
        }),
  })
});

export const {
    useGetLienProjectsQuery,
    useGetLienProjectContractCalculationQuery
} = projectLienApi