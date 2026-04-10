import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { ContactRole, ContactRoleType } from "../../types/contact";
import { County, CustomerTier, CustomerTypeRequest, ProjectRole, ProjectType, State } from "../../types/master";

export const masterDataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<ApiResponse<State[]>, void>({
      query: () => "/countries",
      keepUnusedDataFor: 3600,
    }),

    getAllStates: builder.query<ApiResponse<State[]>, void>({
      query: () => "/states/all",
      keepUnusedDataFor: 3600,
    }),

    getProjectTypes: builder.query<ApiResponse<ProjectType[]>, void>({
      query: () => "/project-types",
      keepUnusedDataFor: 3600,
    }),

    getProjectRoles: builder.query<ApiResponse<ProjectRole[]>, void>({
      query: () => "/project-roles",
      keepUnusedDataFor: 3600,
    }),

    getStates: builder.query<ApiResponse<State[]>, { country_id: number }>({
      query: (body) => ({
        url: "/states",
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 3600,
    }),
    getCounties: builder.query<ApiResponse<County[]>, { state_id: number }>({
      query: (body) => ({
        url: "/counties",
        method: "POST",
        body,
      }),
      keepUnusedDataFor: 3600,
    }),
    getCustomerTypes: builder.query<
      ApiResponse<CustomerTier[]>,
      CustomerTypeRequest
    >({
      query: (body) => ({
        url: "/check-project-roles-customers",
        method: "POST",
        body,
      }),
    }),
    getContactRoles: builder.query<
      ApiResponse<ContactRole[]>,
      { type: ContactRoleType }
    >({
      query: ({ type }) => ({
        url: `/get-contact-roles`,
        params: { type },
      }),
      keepUnusedDataFor: 3600,
    }),
    getUsedStates: builder.query<
      ApiResponse<State[]>, void
    >({
      query: () => "/get-used-states",
      keepUnusedDataFor: 3600,
    }),
    getAllContactCompanies: builder.query<
      ApiResponse<any>, { type: string }
    >({
      query: ({ type }) => ({
        url: "/fetch-companies",
        params: { type },
      }),
      // keepUnusedDataFor: 3600,
    }),
    getAllCompanies: builder.query<
      ApiResponse<any>, void
    >({
      query: () => ({
        url: "/companies",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetStatesQuery,
  useGetAllStatesQuery,
  useGetCountiesQuery,
  useGetProjectTypesQuery,
  useGetProjectRolesQuery,
  useGetCountriesQuery,
  useLazyGetCustomerTypesQuery,
  useGetContactRolesQuery,
  useGetCustomerTypesQuery,
  useGetUsedStatesQuery,
  useGetAllContactCompaniesQuery,
  useLazyGetAllContactCompaniesQuery,
  useLazyGetAllCompaniesQuery
} = masterDataApi;
