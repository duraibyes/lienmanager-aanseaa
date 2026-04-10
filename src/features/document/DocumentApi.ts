import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";

export interface Document {
    id: number;
    title: string;
    file_url: string;
    date: string;
    filename: string;
    file_size_bytes: number;
    file_size: string;
    note: string | null;
}

export interface ProjectDocumentResponse {
    project_id: number;
    project_name: string;
    documents: Document[];
}

export interface ProjectOptions {
    id: number;
    project_name: string;
}

export interface SaveDocument {
    projectId: number;
    documents: {
        url: string;
        name: string;
    }[];
}

export const projectDocumentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProjectDocument: builder.query<ApiResponse<ProjectDocumentResponse[]>, void>({
            query: () => `/documents`,
            providesTags: ['Documents'],
        }),
        getAllProjects: builder.query<ApiResponse<ProjectOptions[]>, void>({
            query: () => `/projects/all`,
            providesTags: ['Projects'],
        }),
        deleteDocument: builder.mutation<
            ApiResponse<any>,
            { documentId: number }
        >({
            query: (body) => ({
                url: "/document/delete/azure",
                method: "POST",
                body,
            }),
            invalidatesTags: ['Documents'],
        }),

        uploadDocument: builder.mutation<
            ApiResponse<any>,
            { projectId: number; files: File[] }
        >({
            query: ({ projectId, files }) => {

                const formData = new FormData();

                formData.append("project_id", projectId.toString());

                files.forEach((file) => {
                    formData.append("documents[]", file);
                });

                return {
                    url: "/documents/upload",
                    method: "POST",
                    body: formData,
                };
            },

            invalidatesTags: ['Documents'],
        }),
        uploadAzureDocument: builder.mutation<ApiResponse<any>, SaveDocument>({
            query: (params) => ({
                url: "/documents/upload/azure",
                method: "POST",
                body: params,
            }),
            invalidatesTags: ['Documents'],
        }),
        readDocument: builder.mutation<
            ApiResponse<any>,
            { document: File }
        >({
            query: ({ document }) => {

                const formData = new FormData();
                formData.append("document", document);

                return {
                    url: "/ai/parse-document",
                    method: "POST",
                    body: formData,
                };
            },
        }),
    }),
});


export const {
    useGetProjectDocumentQuery,
    useDeleteDocumentMutation,
    useUploadDocumentMutation,
    useGetAllProjectsQuery,
    useUploadAzureDocumentMutation,
    useReadDocumentMutation
} = projectDocumentApi;