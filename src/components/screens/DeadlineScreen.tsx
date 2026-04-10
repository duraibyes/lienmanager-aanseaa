import { AlertCircle, Calendar, CheckSquare, Clock, Eye, FileText, Lightbulb, TrendingUp, Users, ChevronRight, Loader2 } from "lucide-react";
import { useGetAllDeadlinesQuery } from "../../features/project/ProjectDeadlineApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState, type ReactNode } from "react";
import DeadlineViewModal, { DeadlineDetails } from "../modals/DeadlineViewModal";

// Design Tokens
const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

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

function StatPill({ label, value, icon: Icon, colorClass }: { label: string; value: number; icon: React.ElementType; colorClass: string }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md h-[72px] w-full min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${colorClass}`}>
                <Icon className="w-4 h-4" />
            </div>

            <div className="flex flex-col justify-center min-w-0 flex-1">
                <p
                    className="text-lg sm:text-xl font-extrabold leading-none text-slate-800"
                    style={{
                        backgroundImage: secondaryGradient,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}
                >
                    {value}
                </p>

                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-tight break-words line-clamp-2">
                    {label}
                </p>
            </div>
        </div>
    );
}

const DeadlineScreen = () => {
    const [selectedDeadline, setSelectedDeadline] = useState<DeadlineDetails | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const { data: deadlines, isLoading } = useGetAllDeadlinesQuery(projectId);
    const navigate = useNavigate();

    const projects = deadlines?.data ?? [];

    const getUrgencyColor = (days: number) => {
        if (days < 0) return 'bg-red-50 text-red-600 border-red-100';
        if (days <= 7) return 'bg-orange-50 text-orange-600 border-orange-100';
        if (days <= 14) return 'bg-yellow-50 text-yellow-600 border-yellow-100';
        return 'bg-green-50 text-green-600 border-green-100';
    };

    const stats = useMemo(() => {
        if (!projects.length) return { totalProjects: 0, overdueProjects: 0, upcomingDeadlines: 0, thisWeek: 0 };

        let overdueProjects = 0;
        let upcomingDeadlines = 0;
        let thisWeek = 0;

        projects.forEach((project: any) => {
            if (project?.is_late) overdueProjects++;

            project?.deadlines?.forEach((d: any) => {
                if (!d?.is_late && d?.daysRemaining <= 30) upcomingDeadlines++;
                if (!d?.is_late && d?.daysRemaining <= 7) thisWeek++;
            });
        });

        return { totalProjects: projects.length, overdueProjects, upcomingDeadlines, thisWeek };
    }, [projects]);

    const projectHighlights = useMemo(() => {
        return projects.map((project: any) => {
            if (!project?.deadlines?.length) return null;

            const overdue = project.deadlines.filter((d: any) => d?.is_late);
            const upcoming = project.deadlines.filter((d: any) => !d?.is_late);

            let selected = null;

            if (overdue.length > 0) {
                selected = overdue.sort((a: any, b: any) => Number(b.daysRemaining) - Number(a.daysRemaining))[0];
            } else if (upcoming.length > 0) {
                selected = upcoming.sort((a: any, b: any) => Number(a.daysRemaining) - Number(b.daysRemaining))[0];
            }

            return selected
                ? {
                      project_id: project.project_id,
                      project_name: project.project_name,
                      is_late: project.is_late,
                      deadline: selected
                  }
                : null;
        }).filter((item): item is NonNullable<typeof item> => item !== null);
    }, [projects]);

    const overdueProjectsList = useMemo(
        () => projectHighlights.filter((p: any) => p?.is_late),
        [projectHighlights]
    );

    const upcomingProjectsList = useMemo(
        () => projectHighlights.filter((p: any) => !p?.is_late),
        [projectHighlights]
    );

    const clearProjectFilter = () => {
        searchParams.delete("projectId");
        setSearchParams(searchParams);
    };

    return (
        <div className="min-h-screen bg-slate-50/70 font-sans antialiased text-slate-900">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* ── Responsive Header ── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div className="flex-1">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
                            <GradientText>Project Deadlines</GradientText>
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                            Monitor critical timelines and filing dates across all active projects
                        </p>
                    </div>

                    {/* Stat Cards - 2x2 on mobile, single row on large screens */}
                    <div className="grid grid-cols-2 lg:flex lg:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
                        <StatPill label="Upcoming" value={stats.upcomingDeadlines} icon={Clock} colorClass="bg-orange-500" />
                        <StatPill label="Overdue" value={stats.overdueProjects} icon={AlertCircle} colorClass="bg-red-500" />
                        <StatPill label="Total Projects" value={stats.totalProjects} icon={Calendar} colorClass="bg-blue-500" />
                        <StatPill label="This Week" value={stats.thisWeek} icon={TrendingUp} colorClass="bg-green-500" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-[#0075be]" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Refreshing Pipeline...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                            <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-slate-50/80 to-blue-50/30">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100">
                                    <Lightbulb className="w-5 h-5" />
                                </div>
                                <GradientText className="font-extrabold uppercase tracking-tight text-sm">Actionable Insights</GradientText>
                            </div>
                            <div className="p-8 grid md:grid-cols-2 gap-6 items-center">
                                <div className="space-y-4 text-sm text-slate-600">
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                        <p className="font-medium"><strong>Immediate Action:</strong> Address the <span className="text-red-600 font-bold">{stats.overdueProjects} overdue items</span> to maintain compliance.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                        <p className="font-medium"><strong>Reminders:</strong> Setting notifications 7-14 days early is recommended for preparation.</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 items-center justify-end">
                                    {[
                                        { label: "Documents", icon: FileText, path: "/documents" },
                                        { label: "View Tasks", icon: CheckSquare, path: "/tasks" },
                                        { label: "Contacts", icon: Users, path: "/contacts" }
                                    ].map((btn) => (
                                        <button
                                            key={btn.label}
                                            onClick={() => navigate(btn.path)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all hover:border-blue-200 shadow-sm"
                                        >
                                            <btn.icon className="w-3.5 h-3.5 text-slate-400" />
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {projectId && (
                            <div className="mb-6 flex items-center justify-between bg-white border border-orange-100 px-6 py-3 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                    Project Filter Active
                                </div>
                                <button onClick={clearProjectFilter} className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                    Remove Filter
                                </button>
                            </div>
                        )}

                        {overdueProjectsList.length > 0 && (
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-4 px-2">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <h2 className="text-[11px] font-black text-red-600 uppercase tracking-[0.15em]">Critical Overdue</h2>
                                </div>
                                <div className="grid gap-3">
                                    {overdueProjectsList.map((item) => (
                                        <div key={item.project_id} className="group bg-white border border-red-100 rounded-2xl p-5 hover:bg-gradient-to-r hover:from-red-50/60 hover:to-transparent transition-all duration-200 shadow-sm hover:shadow-md grid md:grid-cols-[1fr_auto] items-center gap-4">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 font-black border border-red-100 shadow-sm">
                                                    !
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-slate-800 text-sm truncate leading-tight">{item.deadline.title}</h3>
                                                    <p className="text-[11px] text-slate-400 font-bold mt-0.5 truncate">{item.deadline.requirement}</p>
                                                    <p className="text-[10px] text-red-500 font-black mt-1.5 uppercase tracking-widest">{item.project_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 justify-end">
                                                <div className="text-right">
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{item.deadline.date}</p>
                                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">{item.deadline.daysRemaining} overdue</span>
                                                </div>
                                                <button onClick={() => setSelectedDeadline(item)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm whitespace-nowrap active:scale-95">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {upcomingProjectsList.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4 px-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Upcoming Timeline</h2>
                                </div>
                                <div className="grid gap-3">
                                    {upcomingProjectsList.map((item) => (
                                        <div key={item.project_id} className="group bg-white border border-slate-100 rounded-2xl p-5 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-cyan-50/30 transition-all duration-200 shadow-sm hover:shadow-md grid md:grid-cols-[1fr_auto] items-center gap-4">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold shadow-md" style={{ background: primaryGradient }}>
                                                    {item.project_name?.[0]?.toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-slate-800 text-sm truncate leading-tight">{item.deadline.title}</h3>
                                                    <p className="text-[11px] text-slate-400 font-bold mt-0.5 truncate">{item.deadline.requirement}</p>
                                                    <p className="text-[10px] text-blue-500 font-black mt-1.5 uppercase tracking-widest">{item.project_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 justify-end">
                                                <div className="text-right">
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{item.deadline.date}</p>
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${getUrgencyColor(item.deadline.daysRemaining)}`}>
                                                        {item.deadline.daysRemaining}d left
                                                    </span>
                                                </div>
                                                <button onClick={() => setSelectedDeadline(item)} className="p-2.5 bg-blue-50 text-[#0075be] rounded-xl hover:bg-[#0075be] hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm whitespace-nowrap active:scale-95">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedDeadline !== null && (
                <DeadlineViewModal isOpen={selectedDeadline !== null} onClose={() => setSelectedDeadline(null)} data={selectedDeadline} />
            )}
        </div>
    );
};

export default DeadlineScreen;