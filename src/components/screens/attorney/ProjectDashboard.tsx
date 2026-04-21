import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { 
  Filter, 
  Search, 
  FolderKanban, 
  DollarSign, 
  BarChart3, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';

import { PageContainer, PageHeader } from "@/components/layout/page-wrapper";
import { PageTitle, PageSubtitle } from "@/components/ui/typography";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Template from '../../layout/attorney/Template';

import { useGetLienProjectContractCalculationQuery, useGetLienProjectsQuery } from '../../../features/lienAuth/projectsApi';
import { DBLienProject } from '../../../types/liens';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { useMemo } from 'react';

const chartConfig = {
  active: { label: "Active", color: "var(--primary)" },
  pending: { label: "Pending", color: "var(--muted-foreground)" },
};

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
    

    // const totalContracts = totalCalculate?.data?.total_contracts;
    // const totalAmount = totalCalculate?.data?.total_amount;
    // const averageAmount = totalCalculate?.data?.average_amount;

    // Locate these lines (approx line 60-63)
const totalContracts = totalCalculate?.data?.total_contracts || 42; // Dummy: 42
const totalAmount = totalCalculate?.data?.total_amount || 125500.50; // Dummy: $125,500.50
const averageAmount = totalCalculate?.data?.average_amount || 2988.10; // Dummy: $2,988.10

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
      <Template currentPage="projects">
        <div className="p-10 text-center text-destructive">Failed to load project data.</div>
      </Template>
    );
    }
    // Calculate chart data based on the projects returned from the API
    const { pieData, barData } = useMemo(() => {
        //dummy data
    const isUsingDummy = rows.length === 0;

  if (isUsingDummy) {
    return {
      pieData: [
        { name: "Active", value: 25, color: "var(--primary)" },
        { name: "Pending", value: 15, color: "var(--accent)" }
      ],
      barData: [
        { month: "Jan", count: 5 },
        { month: "Feb", count: 8 },
        { month: "Mar", count: 12 },
        { month: "Apr", count: 7 }
      ]
    };
  } //dummy ended

    // 1. Distribution Logic (Pie Chart)
    const activeCount = rows.filter(r => r.status === '1').length;
    const pendingCount = rows.length - activeCount;

    // 2. Trend Logic (Bar Chart - grouped by month)
    const months: Record<string, number> = {};
    rows.forEach(row => {
    const month = new Date(row.created_at).toLocaleString('default', { month: 'short' });
    months[month] = (months[month] || 0) + 1;
    });
  
    const formattedBarData = Object.keys(months).map(m => ({ 
    month: m, 
    count: months[m] 
    }));

   return {
    pieData: [
        { name: "Active", value: activeCount, color: "var(--primary)" },
        { name: "Pending", value: pendingCount, color: "var(--accent)" }
         ],
         barData: formattedBarData
       };
     }, [rows]);  

    return (
    <Template currentPage="projects">
      <PageContainer>
        <PageHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <PageTitle>Manage Projects</PageTitle>
              <PageSubtitle className="mt-1">
                Monitor and manage all construction lien projects and contracts.
              </PageSubtitle>
            </div>
          </div>
        </PageHeader>

        {/* Stats Grid - Using the StatCard from your design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <StatCard 
            title="Total Contracts" 
            value={isFetching ? "..." : totalContracts} 
            icon={FolderKanban}
            description="Active across all states"
          />
          <StatCard 
            title="Total Contract Amount" 
            value={isFetching ? "..." : `$${totalAmount?.toLocaleString()}`} 
            icon={DollarSign}
            description="Cumulative value"
          />
          <StatCard 
            title="Average Amount" 
            value={isFetching ? "..." : `$${averageAmount?.toLocaleString()}`} 
            icon={BarChart3}
            description="Per project average"
          />
        </div>

 {/* Insert this between the Stats Grid and the Project Registry Card */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
  {/* Bar Chart */}
  <Card className="lg:col-span-2 border-none shadow-sm hover:shadow-md transition-shadow duration-300">
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-3">
        {/* Icon wrapper with soft background to match the "Recent Projects" look */}
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <span>Project Intake Trend</span>
      </CardTitle>
    </div>
  </CardHeader>
  
  <CardContent>
    <ChartContainer config={chartConfig} className="h-[300px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          {/* Grid lines added for a more "technical" and professional look */}
          <XAxis 
            dataKey="month" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <ChartTooltip 
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} 
            content={<ChartTooltipContent hideLabel />} 
          />
          
          {/* Bar with a subtle opacity state for a cleaner aesthetic */}
          <Bar 
            dataKey="count" 
            fill="var(--primary)" 
            radius={[6, 6, 0, 0]} 
            barSize={40}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>

  {/* Pie Chart */}
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FolderKanban className="h-5 w-5 text-primary" /> Status Distribution
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={pieData} 
              innerRadius={50} 
              outerRadius={80} 
              paddingAngle={2} 
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex justify-center gap-4 mt-4">
        {pieData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name} ({item.value})
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
  </div>
        {/* Main Data Table Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Project Registry
            </CardTitle>
            
            <div className="flex items-center gap-3">
               {/* Search bar inside header for a cleaner look */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-primary outline-none min-w-[240px]"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid<DBLienProject>
                rows={rows}
                loading={isLoading}
                columns={columns}
                onRowClick={(params) => navigate(`/attorney/projects/${params.row.id}`)}
                slots={{
                  noRowsOverlay: () => (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <p>{debouncedSearch ? `No results for "${debouncedSearch}"` : "No projects available"}</p>
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
                    backgroundColor: "transparent",
                    borderBottom: "1px solid hsl(var(--border))",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                    color: "hsl(var(--foreground))",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid hsl(var(--border))",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "hsl(var(--muted)/0.5)",
                    cursor: "pointer",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid hsl(var(--border))",
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </Template>
  );
};

export default ProjectDashboard;