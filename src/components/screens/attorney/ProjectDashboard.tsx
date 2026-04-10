import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { Filter, Search } from 'lucide-react';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import Template from '../../layout/attorney/Template'
import { useGetLienProjectContractCalculationQuery, useGetLienProjectsQuery } from '../../../features/lienAuth/projectsApi';
import { DBLienProject } from '../../../types/liens';

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

        <Template currentPage="projects">
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600 mb-2">Total Contracts</p>
                        <p className="text-4xl font-bold text-blue-600">{isFetching ? '...' : totalContracts}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600 mb-2">Total Contract Amount</p>
                        <p className="text-4xl font-bold text-blue-600">${isFetching ? '...' : totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600 mb-2">Average Contract Amount</p>
                        <p className="text-4xl font-bold text-blue-600">${isFetching ? '...' : averageAmount.toFixed(2)}</p>
                    </div>
                </div>

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
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Filter Button */}
                            <button
                                className="flex items-center justify-start sm:justify-start gap-2 
                px-4 py-2 border border-gray-300 rounded-lg 
                hover:bg-gray-50 transition-colors w-full sm:w-auto"
                            >
                                <Filter className="w-5 h-5" />
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
                                    backgroundColor: "#f1f5f9",
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    fontWeight: 600,
                                    color: "#334155",
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    borderBottom: "1px solid #e2e8f0",
                                },
                                "& .MuiDataGrid-columnHeader:hover": {
                                    backgroundColor: "#e2e8f0",
                                },
                                "& .MuiDataGrid-row": {
                                    cursor: "pointer",
                                },
                                "& .MuiDataGrid-row:hover": {
                                    backgroundColor: "rgb(248 250 252)",
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </Template>
    )
}

export default ProjectDashboard