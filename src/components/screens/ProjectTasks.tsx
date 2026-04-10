import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Calendar, 
  User, 
  ClipboardCheck, 
  Activity,
  Briefcase
} from 'lucide-react';
import TotalCountCards from '../Parts/Task/TotalCountCards';
import { useGetTasksQuery } from '../../features/task/taskDataApi';
import FilterPane from '../Parts/Task/FilterPane';
import { DBTask } from '../../types/tasks';
import TaskView from '../Parts/Task/TaskView';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

/**
 * Shared Grid Layout Constant
 * Using minmax to ensure columns have a baseline width before scrolling kicks in.
 */
const TABLE_GRID_LAYOUT = "grid grid-cols-[minmax(220px,1.8fr)_minmax(180px,1.5fr)_minmax(150px,1.2fr)_minmax(150px,1.2fr)_minmax(120px,1fr)_100px] items-center gap-4";

function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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

// ── Custom Row Component ──────────────────────────────────────────────────────
function TaskRow({ task, onView }: { task: DBTask, onView: (id: number) => void }) {
    
    const getUrgencyStyles = (days: number) => {
        if (days < 0) return 'bg-red-50 text-red-600 border-red-100';
        if (days <= 7) return 'bg-orange-50 text-orange-600 border-orange-100';
        if (days <= 14) return 'bg-yellow-50 text-yellow-600 border-yellow-100';
        return 'bg-slate-50 text-slate-400 border-slate-100';
    };

    const statusFormatted = (task.status || "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <div className={`${TABLE_GRID_LAYOUT} px-6 py-4 border-b border-slate-100 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-cyan-50/30 transition-all duration-200 group last:border-0`}>
            
            {/* 1. Project & Task Name */}
            <div className="flex items-center gap-3 min-w-0">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold shadow-md"
                    style={{ background: primaryGradient }}
                >
                    {task.project_name?.[0]?.toUpperCase() ?? "T"}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                        {task.task_name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-bold mt-0.5 truncate uppercase tracking-tight">
                        {task.project_name}
                    </p>
                </div>
            </div>

            {/* 2. Task Action */}
            <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs truncate">
                    <ClipboardCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate font-medium">{task.task_action_name || "General Task"}</span>
                </div>
            </div>

            {/* 3. Ownership */}
            <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs truncate font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate font-semibold text-slate-800">{task.assigned_to_user?.name || "Unassigned"}</span>
                </div>
                <p className="text-[10px] text-slate-400 ml-5 truncate font-medium">
                    {task.assigned_at || "—"}
                </p>
            </div>

            {/* 4. Timeline */}
            <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium truncate">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{task.due_date}</span>
                </div>
                <div className="ml-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getUrgencyStyles(Number(task.days_difference))}`}>
                        {task.due_status}
                    </span>
                </div>
            </div>

            {/* 5. Status Pill */}
            <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white border border-slate-200 text-slate-500 shadow-sm transition-all">
                    <Activity className="w-3 h-3 text-[#00aeea]" />
                    {statusFormatted}
                </span>
            </div>

            {/* 6. Action Button (Hover Effect) */}
            <div className="flex justify-end">
                <button
                    onClick={() => onView(task.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0075be] bg-blue-50 hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap active:scale-95"
                >
                    <Eye className="w-3.5 h-3.5" />
                    View
                </button>
            </div>
        </div>
    );
}

export default function ProjectTasks() {
    const location = useLocation();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState(location.state?.project_name || "");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [selectedTask, setSelectedTask] = useState<number | null>(null);

    const { data, isLoading } = useGetTasksQuery({
        page: page + 1,
        per_page: pageSize,
        search: debouncedSearch,
        action_id: actionFilter === "all" ? undefined : actionFilter,
    });

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
        <div className="min-h-screen bg-slate-50/70 font-sans antialiased text-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

                {/* ── Responsive Header ── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                            <GradientText>Project Tasks</GradientText>
                        </h1>
                        <p className="text-slate-500 text-sm sm:text-[14px] mt-2 font-medium">
                            Monitor task progress, deadlines, and team assignments
                        </p>
                    </div>
                    <div className="w-full lg:w-auto">
                        <TotalCountCards />
                    </div>
                </div>

                <div className="mb-8">
                    <FilterPane
                        filterStatus={actionFilter}
                        setFilterStatus={setActionFilter}
                        search={search}
                        setSearch={setSearch}
                    />
                </div>

                {/* ── Main Panel (Responsive Container) ── */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/10 overflow-hidden">
                    
                    <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
                        <div className="flex items-center gap-2">
                            <GradientText className="text-[16px] font-black uppercase tracking-tight text-[#003F58]">Task Pipeline</GradientText>
                            {total > 0 && (
                                <span className="ml-1 px-2.5 py-0.5 rounded-full text-[11px] font-black text-white shadow-sm" style={{ background: primaryGradient }}>
                                    {total}
                                </span>
                            )}
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#0075be] uppercase tracking-widest cursor-default">
                            <span>Synced Data</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    {/* ── MOBILE RESPONSIVE SCROLLER WRAPPER ── */}
                    <div className="overflow-x-auto overflow-y-hidden slim-scrollbar">
                        <div className="min-w-[1000px]"> {/* Forces the grid to keep its alignment */}
                            
                            {/* Table Column Headers */}
                            <div className={`${TABLE_GRID_LAYOUT} gap-4 px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400`}>
                                <span>Task & Project</span>
                                <span>Action Category</span>
                                <span>Ownership</span>
                                <span>Timeline</span>
                                <span>Status</span>
                                <span className="text-right">Actions</span>
                            </div>

                            {/* Table Body */}
                            <div className="max-h-[600px] overflow-y-auto">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                                        <Loader2 className="w-10 h-10 animate-spin text-[#0075be]" />
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Refreshing...</p>
                                    </div>
                                ) : rows.length === 0 ? (
                                    <div className="py-24 text-center">
                                        <Briefcase className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                        <p className="text-slate-700 font-semibold">No tasks yet</p>
                                    </div>
                                ) : (
                                    rows.map((task: DBTask) => (
                                        <TaskRow 
                                            key={task.id} 
                                            task={task} 
                                            onView={(id) => setSelectedTask(id)} 
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pagination Footer */}
                    {!isLoading && rows.length > 0 && (
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Records: <span className="text-[#0075be]">{rows.length}</span> / <span className="text-slate-600">{total}</span>
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-[#0075be] disabled:opacity-20 transition-all active:scale-90"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-1 mx-2">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i)}
                                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                                page === i ? "bg-[#0075be] text-white shadow-md scale-105" : "text-slate-500 hover:bg-slate-100 border border-slate-100"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-[#0075be] disabled:opacity-20 transition-all active:scale-90"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedTask && (
                <TaskView 
                    taskId={selectedTask} 
                    onClose={() => setSelectedTask(null)} 
                />
            )}
        </div>
    );
}