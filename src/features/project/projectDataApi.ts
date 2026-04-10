import { api } from "../../services/api";
import { ApiResponse } from "../../types/api";
import { RemedyDateRequest, RemedyDateType } from "../../types/date";
import { ProjectListRequest, ProjectStatusCount, ProjectViewResponse, ProjectWizardData } from "../../types/project";

export interface SaveWizardStepRequest {
  draft_id?: number;
  step: number;
  data: Partial<ProjectWizardData>;
}

export interface FinalProjectRequest {
  data: ProjectWizardData;
}

/* ---------------- API ---------------- */

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({

    /* ---------- SAVE WIZARD STEP (AUTO-SAVE) ---------- */
    saveWizardStep: builder.mutation<
      ApiResponse<{ draft_id: number }>,
      SaveWizardStepRequest
    >({
      query: (body) => ({
        url: "/projects/wizard/save-step",
        method: "POST",
        body,
      }),
    }),

    /* ---------- GET DRAFT (RESUME) ---------- */
    getProjectInfo: builder.query<
      ApiResponse<ProjectViewResponse>,
      { projectId: number }
    >({
      query: (params) => ({
        url: "/project",
        params,
      }),
      providesTags: (_result, _error, arg) => [
        { type: "Project", id: arg.projectId }
      ],
    }),

    /* ---------- FINAL SUBMIT ---------- */
    submitProject: builder.mutation<
      ApiResponse<any>,
      any
    >({
      query: (body) => ({
        url: "/save-project",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, body) => {
        const projectId = body?.projectId;

        return [
          "Projects",
          "ProjectStatus",
          projectId
            ? { type: "Project", id: Number(projectId) }
            : "Project",
        ];
      },
    }),

    /* ---------- DELETE DRAFT AFTER SUBMIT ---------- */
    deleteWizardDraft: builder.mutation<ApiResponse<any>,
      { id: number }
    >({
      query: (body) => ({
        url: `/project/delete`,
        method: "POST",
        body
      }),
      invalidatesTags: ["Projects", "ProjectStatus"],
    }),
    getRemedyDates: builder.query<
      ApiResponse<RemedyDateType[]>,
      RemedyDateRequest
    >({
      query: (body) => ({
        url: "/remedy-dates",
        method: "POST",
        body,
      }),
    }),
    /* ---------- PROJECT STATUS COUNT ---------- */
    getProjectStatusCount: builder.query<
      ApiResponse<ProjectStatusCount>,
      void
    >({
      query: () => ({
        url: "/total-project-count",
        method: "GET",
      }),
      providesTags: ["ProjectStatus"],
    }),
    getProjects: builder.query<
      ApiResponse<any>,
      ProjectListRequest
    >({
      query: (params) => ({
        url: "/projects",
        method: "GET",
        params,
      }),
      providesTags: ["Projects"],
    }),

  }),

  overrideExisting: false,
});

/* ---------------- HOOK EXPORTS ---------------- */

export const {
  useSaveWizardStepMutation,
  useGetProjectInfoQuery,
  useSubmitProjectMutation,
  useDeleteWizardDraftMutation,
  useGetRemedyDatesQuery,
  useGetProjectStatusCountQuery,
  useGetProjectsQuery
} = projectApi;