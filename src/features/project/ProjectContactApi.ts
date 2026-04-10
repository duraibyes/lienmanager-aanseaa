import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { Customer } from "../../types/customer";
import { ProjectListRequest } from "../../types/project";

export interface ProjectContact {
    title: any;
    id: number;
    company: string;
    email: string;
    website: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    state_id?: number;
    fax?: string;
    companyId?: number;
    created_at: string;
    updated_at?: string;
    contacts: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        directPhone: string;
        cell: string;
        role_id? : number;
        role?: string;
    }[];
}

export const ProjectContactApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProjectContacts: builder.query<
            {
                customerContact: any[];
                projectContact: any[];
            },
            void
        >({
            query: () => "/project-contacts-all",
            providesTags: ["ProjectContacts"],
            // keepUnusedDataFor: 3600,
        }),

        uploadCustomerExcel: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/upload-customer-contact-excel",
                method: "POST",
                body: formData,
            }),
        }),
         getCustomerContacts: builder.query<
              ApiResponse<any>,
              ProjectListRequest
            >({
              query: (params) => ({
                url: "/customer-contacts",
                method: "GET",
                params,
              }),
               providesTags: ["CustomerContacts"],
            }),
        submitCustomerContact: builder.mutation<
              ApiResponse<any>,
              Customer
            >({
              query: (body) => ({
                url: "/save-customer-contact",
                method: "POST",
                body,
              }),
              invalidatesTags: ["ProjectContacts", "CustomerContacts"],
            }),

            submitProjectContact: builder.mutation<
              ApiResponse<any>,
              Customer
            >({
              query: (body) => ({
                url: "/save-project-contact",
                method: "POST",
                body,
              }),
              invalidatesTags: ["ProjectContacts"],
            }),
            deleteCustomerContact: builder.mutation<
              ApiResponse<any>,
              { id: number }
            >({
              query: (body) => ({
                url: "/customer-contacts/delete",
                method: "POST",
                body,
              }),
              invalidatesTags: ["CustomerContacts"],
            }),
    }),
    overrideExisting: false,
});

export const {
    useGetProjectContactsQuery,
    useUploadCustomerExcelMutation,
    useSubmitCustomerContactMutation,
    useSubmitProjectContactMutation,
    useGetCustomerContactsQuery,
    useDeleteCustomerContactMutation,
} = ProjectContactApi;