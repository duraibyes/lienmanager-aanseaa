import { useEffect, useState, type ReactNode } from "react";
import { 
  ChevronRight, 
  Loader2, 
  Building, 
  MapPin, 
  BadgeDollarSign, 
  CalendarDays, 
  ChevronLeft,
  CircleDot,
  Briefcase,
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
      
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-md"
          style={{ background: primaryGradient }}
        >
          {project?.project_name?.[0]?.toUpperCase() ?? 'P'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{project?.project_name || '—'}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">
            ID: {project?.id}
          </p>
        </div>
      </div>

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

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
          <BadgeDollarSign className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="truncate">
            {project?.project_contract?.base_amount 
              ? Number(project.project_contract.base_amount).toLocaleString() 
              : "0.00"}
          </span>
        </div>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium truncate">
          <div className="w-5 flex justify-center flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="truncate">{project?.state || "—"}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
          <div className="w-5 flex justify-center flex-shrink-0">
            <CalendarDays className="w-3 h-3 text-slate-300" />
          </div>
          <span className="truncate">
            {project?.created_at ? new Date(project.created_at).toLocaleDateString() : "—"}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          isActive 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
            : "bg-amber-50 text-amber-700 border-amber-200"
        }`}>
          <CircleDot className={`w-2 h-2 mr-1.5 ${isActive ? "text-emerald-500" : "text-amber-500"}`} />
          {isActive ? "Active" : "Pending"}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-150">
        <QuickActionColumn data={project} />
        <ActionColumn data={project} />
      </div>
    </div>
  );
}

export default function RecentProjectsScreen() {
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

  const rows: DBProject[] = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.length >= 3 || search.length === 0) {
        setDebouncedSearch(search);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

 return (
    <div className="min-h-screen bg-slate-50/70 font-sans antialiased">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
  {/* Left Section: Heading & Subtitle */}
  <div className="flex flex-col">
    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
      <GradientText>Recent Projects</GradientText>
    </h1>
    <p className="text-slate-500 text-xs sm:text-sm mt-2 font-medium">
      Oversee and manage your industrial project portfolio
    </p>
  </div>

  <div className="w-full lg:w-auto">
    <TotalCountCards />
  </div>
</div>

        <div className="mt-2">
          <FilterPane
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
            stateData={stateData?.data || []}
          />
        </div>

        {/* ── Main Table Panel ── */}
        <div className="mt-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">

          <div
            className="px-8 py-5 flex items-center justify-between border-b border-slate-100"
            style={{ background: "linear-gradient(to right, #f8fafc, #f0f7ff)" }}
          >
            <div className="flex items-center gap-2">
              <GradientText className="text-base font-extrabold">Active Projects</GradientText>
              {total > 0 && (
                <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-sm" style={{ background: primaryGradient }}>
                  {total}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#0075be] cursor-default select-none">
              <span>Updated recently</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* TABLE HEADER 
              Syncing GRID_CONFIG here to match the rows below 
          */}
          <div className={`grid ${GRID_CONFIG} gap-4 px-8 py-3 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400`}>
            <span>Project Details</span>
            <span>Customer / Contact</span>
            <span>Contract</span>
            <span>Location / Date</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="min-h-[400px] max-h-[600px] overflow-y-auto overflow-x-hidden slim-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-[#0075be]" />
                <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">Synchronizing records...</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-1 shadow-lg" style={{ background: primaryGradient }}>
                  <Briefcase className="w-7 h-7" />
                </div>
                <p className="text-slate-700 font-bold">No projects found</p>
                <p className="text-slate-400 text-sm max-w-xs">{debouncedSearch ? `No matches for "${debouncedSearch}"` : "You haven't added any projects yet."}</p>
              </div>
            ) : (
              rows.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))
            )}
          </div>

          {/* Footer */}
          {!isLoading && rows.length > 0 && (
            <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-600">{rows.length}</span> of <span className="font-bold text-slate-600">{total}</span> records
              </p>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 px-1 py-1 bg-slate-100 rounded-2xl">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                        page === i ? "bg-white text-[#0075be] shadow-sm" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}