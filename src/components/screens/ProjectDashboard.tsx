import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import TotalCountCards from "../Parts/Project/TotalCountCards";
import { useGetProjectsQuery } from "../../features/project/projectDataApi";
import { useGetUsedStatesQuery } from "../../features/master/masterDataApi";
import FilterPane from "../Parts/Project/FilterPane";
import { DBProject } from "../../types/project";
import ActionColumn from "../Parts/Project/ActionColumn";
import QuickActionColumn from "../Parts/Project/QuickActionColumn";
import NewProjectCreateCard from "../Parts/Project/NewProjectCreateCard";
import LinkButton from "../Button/LinkButton";

export default function ProjectDashboard() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  const { data, isLoading } = useGetProjectsQuery({
    page: page + 1,
    per_page: pageSize,
    sort_by: sortModel[0]?.field || "created_at",
    sort_dir: sortModel[0]?.sort || "desc",
    search: debouncedSearch,
    status: statusFilter === "all" ? undefined : statusFilter,
    state_id: stateFilter === "all" ? undefined : stateFilter,
  });

  const { data: stateData } = useGetUsedStatesQuery();

  const rows = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const overall_total = data?.overall_total;

  const columns: GridColDef<DBProject>[] = [
    {
      field: "project_name", headerName: "Project", flex: 1, minWidth: 180,
      renderCell: (params) => {
        const row = params.row;
        return (
          <LinkButton to={`/project/${row.id}`} label={row.project_name} />
        )
      }
    },
    {
      field: "base_amount", headerName: "Contract", flex: 1, minWidth: 180,
      valueGetter: (_value, row) =>
        row.project_contract?.base_amount ?? "",

    },
    {
      field: "state", headerName: "State", flex: 1, minWidth: 180,
    },
    {
      field: "status", headerName: "Status", flex: 1, minWidth: 50,
      valueGetter: (_value, row) => {
        const value = row.status;
        return value === '1' ? 'Active' : 'Pending';
      },
    },
    {
      field: "created_at",
      headerName: "Created",
      flex: 1,
      minWidth: 70,
      valueGetter: (_value, row) => {
        const value = row.created_at;
        if (!value) return "";
        return new Date(value).toLocaleDateString();
      },
    },
    {
      field: "action", headerName: " Action", flex: 0, minWidth: 120, sortable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <div className="flex flex-row">
            <ActionColumn data={row} />
            <QuickActionColumn data={row} />
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.length >= 3 || search.length === 0) {
        setDebouncedSearch(search);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans antialiased">
      <div className="px-2 sm:px-6">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex-">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-none">
              Project Dashboard
            </h1>
            <p className="text-textMuted text-xs sm:text-sm mt-1 font-normal">
              Oversee and manage your industrial project portfolio
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <TotalCountCards />
          </div>
        </div>

        {overall_total === 0 && !isLoading && (
          <NewProjectCreateCard />
        )}

        <FilterPane
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          stateData={stateData?.data || []}
        />

        <div className="bg-white rounded-lg border border-slate-200">
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid<DBProject>
              rows={rows}
              loading={isLoading}
              columns={columns}
              slots={{
                noRowsOverlay: () => (
                  <div className="p-6 text-center">
                    {debouncedSearch
                      ? `No results for "${debouncedSearch}"`
                      : "No projects available"}
                  </div>
                ),
              }}
              getRowId={(row) => row.id}
              rowCount={total}
              paginationMode="server"
              sortingMode="server"
              pageSizeOptions={[10, 25, 50]}
              paginationModel={{ page, pageSize }}
              onPaginationModelChange={(model) => {
                setPage(model.page);
                setPageSize(model.pageSize);
              }}
              onSortModelChange={(model) => setSortModel([...model])}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#0075be",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                  color: "#fff", // slate-700
                },
                "& .MuiDataGrid-columnHeaders": {
                  borderBottom: "1px solid #e2e8f0",
                },
                "& .MuiDataGrid-columnHeader:hover": {
                  backgroundColor: "#1d4ed8",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgb(248 250 252)",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}