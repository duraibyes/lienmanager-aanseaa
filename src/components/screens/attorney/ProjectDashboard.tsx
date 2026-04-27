import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { Filter, Search } from 'lucide-react';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { useGetLienProjectContractCalculationQuery, useGetLienProjectsQuery } from '../../../features/lienAuth/projectsApi';
import { DBLienProject } from '../../../types/liens';
import { PageContainer, PageHeader } from '@/components/layout/page-wrapper';
import { PageSubtitle, PageTitle } from '@/components/ui/typography';
import TotalCountCards from './TotalCountCards';

const ProjectDashboard = () => {

    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data, isLoading } = useGetLienProjectsQuery({
        page: page + 1,
        per_page: pageSize,
        sort_by: sortModel[0]?.field || "created_at",
        sort_dir: sortModel[0]?.sort || "desc",
        search: debouncedSearch,
    });

    const {
        data: totalCalculate,
        isFetching,

        isError,
        error
    } = useGetLienProjectContractCalculationQuery();

    const rows = data?.data || [];
    const total = data?.total || 0;

    const totalContracts = totalCalculate?.data?.total_contracts;
    const totalAmount = totalCalculate?.data?.total_amount;
    const averageAmount = totalCalculate?.data?.average_amount;

    const columns: GridColDef<DBLienProject>[] = [
        { field: "project_name", headerName: "Project", flex: 1, minWidth: 180, },
        { field: "company_name", headerName: "Client Company", flex: 1, sortable: false, minWidth: 180, },
        { field: "customer_name", headerName: "Customer", flex: 1, sortable: false, minWidth: 180, },
        {
            field: "created_at",
            headerName: "Entry Date",
            flex: 1,
            minWidth: 100,
            valueGetter: (_value, row) => {
                const value = row.created_at;
                if (!value) return "";
                return new Date(value).toLocaleDateString();
            },
        },
        {
            field: "project_contract", headerName: "Contract", flex: 1, minWidth: 100,
            valueGetter: (_value, row) =>
                row.project_contract ?? "",

        },
        {
            field: "state", headerName: "State", flex: 1, minWidth: 100,
        },
        {
            field: "project_type", headerName: "Type", flex: 1, minWidth: 75,
            valueGetter: (_value, row) => row?.project_type,
        },
        {
            field: "status", headerName: "Status", flex: 1, minWidth: 100,
            valueGetter: (_value, row) => {
                const value = row.status;
                return value === '1' ? 'Active' : 'Pending';
            },
        },
        {
            field: "lien_provider", headerName: "LienProvider", flex: 1, minWidth: 180,
        },


    ];

    useEffect(() => {
        const handler = setTimeout(() => {
            if (search.length >= 3 || search.length === 0) {
                setDebouncedSearch(search);
            }
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [search]);


    if (isError) {
        console.error("API Error:", error);

        return (
            <div className="text-center py-10 text-red-500">
                Failed to load contract calculations
            </div>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <PageTitle>Projects</PageTitle>
                        <PageSubtitle className="mt-1">
                            Welcome back! Here&apos;s an overview of your projects.
                        </PageSubtitle>
                    </div>

                </div>
            </PageHeader>

            <TotalCountCards isFetching={isFetching}
                totalContracts={totalContracts}
                totalAmount={totalAmount}
                averageAmount={averageAmount}
            />


            <div className="bg-white rounded-lg shadow">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">

                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                    focus:ring-4 focus:ring-primary/40 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Filter Button */}
                        <button
                            className="flex items-center justify-start sm:justify-start gap-2 
                px-4 py-2 border border-gray-300 rounded-lg 
                hover:bg-gray-50 transition-colors w-full sm:w-auto text-primary"
                        >
                            <Filter className="w-5 h-5 text-primary" />
                            Filters
                        </button>

                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200">
                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid<DBLienProject>
                        rows={rows}
                        loading={isLoading}
                        columns={columns}
                        onRowClick={(params) => {
                            navigate(`/attorney/projects/${params.row.id}`);
                        }}
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
                                backgroundColor: "#d0744b",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: 600,
                                color: "#fff", // slate-700
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                borderBottom: "1px solid #e2e8f0",
                            },

                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#fff",
                            },
                        }}
                    />
                </div>
            </div>
        </PageContainer>
    )
}

export default ProjectDashboard