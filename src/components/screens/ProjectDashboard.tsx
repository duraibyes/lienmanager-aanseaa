import { useEffect, useState, type ReactNode } from "react";
import {
  Loader2,
  Building,
  MapPin,
  BadgeDollarSign,
  CalendarDays,
  CircleDot,
  Phone
} from "lucide-react";

// API & Components
import TotalCountCards from "../Parts/Project/TotalCountCards";
import { useGetProjectsQuery } from "../../features/project/projectDataApi";
import { useGetUsedStatesQuery } from "../../features/master/masterDataApi";
import FilterPane from "../Parts/Project/FilterPane";
import { DBProject } from "../../types/project";
import ActionColumn from "../Parts/Project/ActionColumn";
import QuickActionColumn from "../Parts/Project/QuickActionColumn";

// Design Tokens
const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

const GRID_CONFIG = "grid-cols-[minmax(200px,2fr)_minmax(150px,1.5fr)_minmax(100px,1fr)_minmax(120px,1.2fr)_minmax(100px,1fr)_140px]";

function GradientText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: secondaryGradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function ProjectRow({ project }: { project: DBProject }) {
  const isActive = project?.status === "1";

  return (
    <div className={`group grid ${GRID_CONFIG} items-center gap-4 px-8 py-4 border-b border-slate-100 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-cyan-50/30 transition-all duration-200 last:border-0`}>

      {/* 1. Project Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold shadow-md"
          style={{ background: primaryGradient }}
        >
          {project?.project_name?.[0]?.toUpperCase() ?? 'P'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{project?.project_name || '—'}</p>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none mt-1">
            ID: {project?.id}
          </p>
        </div>
      </div>

      {/* 2. Customer */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-slate-600 text-xs truncate">
          <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate font-medium">{project?.city || "No Customer"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 text-xs truncate">
          <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate font-medium">{project?.zip || "No Contact"}</span>
        </div>
      </div>

      {/* 3. Contract */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
          <BadgeDollarSign className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="truncate">
            {project?.project_contract?.base_amount
              ? Number(project.project_contract.base_amount).toLocaleString()
              : "0.00"}
          </span>
        </div>
      </div>

      {/* 4. Location */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium truncate">
          <div className="w-5 flex justify-center flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="truncate">{project?.state || "—"}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5 font-normal">
          <div className="w-5 flex justify-center flex-shrink-0">
            <CalendarDays className="w-3.5 h-3.5 text-slate-300" />
          </div>
          <span className="truncate">
            {project?.created_at ? new Date(project.created_at).toLocaleDateString() : "—"}
          </span>
        </div>
      </div>

      {/* 5. Status */}
      <div className="min-w-0">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${isActive
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
          <CircleDot className={`w-2.5 h-2.5 mr-1.5 ${isActive ? "text-emerald-500" : "text-amber-500"}`} />
          {isActive ? "Active" : "Pending"}
        </span>
      </div>

      {/* 6. Actions */}
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-150">
        <QuickActionColumn data={project} />
        <ActionColumn data={project} />
      </div>
    </div>
  );
}

export default function ProjectDashboard() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  const { data, isLoading } = useGetProjectsQuery({
    page: page + 1,
    per_page: pageSize,
    search: debouncedSearch,
    status: statusFilter === "all" ? undefined : statusFilter,
    state_id: stateFilter === "all" ? undefined : stateFilter,
  });

  const { data: stateData } = useGetUsedStatesQuery();

  const rows = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.length >= 3 || search.length === 0) setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans antialiased">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
              <GradientText>Project Dashboard</GradientText>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              Oversee and manage your industrial project portfolio
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <TotalCountCards />
          </div>
        </div>

        <FilterPane
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          stateData={stateData?.data || []}
        />

        <div className="mt-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className={`grid ${GRID_CONFIG} gap-4 px-8 py-3 bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400`}>
            <span>Project Details</span>
            <span>Customer / Info</span>
            <span>Contract</span>
            <span>Location / Date</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-[#0075be]" />
              </div>
            ) : rows.map((project: DBProject) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}