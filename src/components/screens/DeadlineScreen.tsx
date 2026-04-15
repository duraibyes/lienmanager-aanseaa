import { AlertCircle, Calendar, CheckSquare, Clock, Eye, FileText, Lightbulb, TrendingUp, Users } from "lucide-react";
import { useGetAllDeadlinesQuery } from "../../features/project/ProjectDeadlineApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import DeadlineViewModal, { DeadlineDetails } from "../modals/DeadlineViewModal";
import DeadlineTotalCard from "../Parts/Deadlines/DeadlineTotalCard";

const DeadlineScreen = () => {

    const [selectedDeadline, setSelectedDeadline] = useState<DeadlineDetails | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const projectId = searchParams.get("projectId");

    const { data: deadlines, isLoading } = useGetAllDeadlinesQuery(projectId);
    const navigate = useNavigate();

    const projects = deadlines?.data ?? [];

    const getUrgencyColor = (days: number) => {
        if (days < 0) return 'bg-red-100 border-red-300 text-red-900';
        if (days <= 7) return 'bg-orange-100 border-orange-300 text-orange-900';
        if (days <= 14) return 'bg-yellow-100 border-yellow-300 text-yellow-900';
        return 'bg-green-100 border-green-300 text-green-900';
    };

    const stats = useMemo(() => {
        if (!projects.length) {
            return {
                totalProjects: 0,
                overdueProjects: 0,
                upcomingDeadlines: 0,
                thisWeek: 0
            };
        }

        let overdueProjects = 0;
        let upcomingDeadlines = 0;
        let thisWeek = 0;

        projects.forEach(project => {

            if (project.is_late) {
                overdueProjects++;
            }

            project.deadlines?.forEach((d: any) => {

                if (!d.is_late && d.daysRemaining <= 30) {
                    upcomingDeadlines++;
                }

                if (!d.is_late && d.daysRemaining <= 7) {
                    thisWeek++;
                }

            });

        });

        return {
            totalProjects: projects.length,
            overdueProjects,
            upcomingDeadlines,
            thisWeek
        };

    }, [projects]);

    const clearProjectFilter = () => {
        searchParams.delete("projectId");
        setSearchParams(searchParams);
    };

    const projectHighlights = useMemo(() => {
        const projects = deadlines?.data ?? [];

        return projects.map((project: any) => {

            if (!project.deadlines?.length) return null;

            const overdue = project.deadlines.filter((d: any) => d.is_late);
            const upcoming = project.deadlines.filter((d: any) => !d.is_late);

            let selectedDeadline = null;

            if (overdue.length > 0) {
                // pick most overdue (largest daysRemaining)
                selectedDeadline = overdue.sort(
                    (a: any, b: any) => Number(b.daysRemaining) - Number(a.daysRemaining)
                )[0];
            } else if (upcoming.length > 0) {
                // pick nearest upcoming (smallest daysRemaining)
                selectedDeadline = upcoming.sort(
                    (a: any, b: any) => Number(a.daysRemaining) - Number(b.daysRemaining)
                )[0];
            }

            return {
                project_id: project.project_id,
                project_name: project.project_name,
                is_late: project.is_late,
                deadline: selectedDeadline
            };

        }).filter(Boolean);

    }, [deadlines]);

    const overdueProjects = useMemo(() => {
        return projectHighlights.filter((p: any) => p.is_late);
    }, [projectHighlights]);

    const upcomingProjects = useMemo(() => {
        return projectHighlights.filter((p: any) => !p.is_late);
    }, [projectHighlights]);

    return (
        <div className="px-2 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">

                <div className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-none">Project Deadlines</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-2 font-normal">
                        Track all upcoming and overdue deadlines across your projects
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
                    <DeadlineTotalCard
                        title="Upcoming (30 days)"
                        value={stats.upcomingDeadlines}
                        icon={Clock}
                    />
                    <DeadlineTotalCard
                        title="Overdue"
                        value={stats.overdueProjects}
                        icon={AlertCircle}
                    />
                    <DeadlineTotalCard
                        title="Total Active"
                        value={stats.totalProjects}
                        icon={Calendar}
                    />
                    <DeadlineTotalCard
                        title="This Week"
                        value={stats.thisWeek}
                        icon={TrendingUp}
                    />
                </div>
            </div>


            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading deadlines...</p>
                    </div>
                </div>
            ) : (
                projects.length > 0 && (
                    <>

                        {projectId && (
                            <div className="my-4 flex items-center justify-between bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
                                <p className="text-sm text-orange-900">
                                    Project filter is applied
                                </p>

                                <button
                                    onClick={clearProjectFilter}
                                    className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Remove Filter
                                </button>
                            </div>
                        )}
                        {overdueProjects.length > 0 &&
                            <div className="my-6">
                                <h2 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Delayed Deadlines
                                </h2>
                                <div className="flex flex-row gap-4">
                                    {overdueProjects?.map((deadline) => {
                                        return (
                                            <div
                                                key={deadline?.project_id}
                                                className="bg-white border-2 border-red-300 rounded-lg p-3 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex flex-col items-center  gap-3">
                                                    <div className="">
                                                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{deadline?.deadline?.title}</h3>
                                                        <h5 className="font-semibold text-slate-800 text-sm truncate">
                                                            {deadline?.deadline?.requirement}
                                                        </h5>
                                                        <p className="text-xs text-slate-600 truncate">{deadline?.project_name}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <div className="flex items-center flex-row justify-between gap-2 text-xs">
                                                            <p className="text-xs text-slate-500">{deadline?.deadline.date}</p>
                                                            <p className="inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                                {deadline?.deadline?.daysRemaining} overdue
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedDeadline(deadline)}
                                                            className="w-full flex items-center justify-center  gap-1 
                                                            px-3 py-1.5 bg-red-50 text-orange-900 text-xs sm:text-sm font-medium 
                                                            rounded hover:bg-red-100 transition-colors"
                                                        >
                                                            <Eye className="w-4  h-4 " />
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        }
                        {upcomingProjects.length > 0 &&
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Upcoming Deadlines
                                </h2>
                                <div className="space-y-2">
                                    {upcomingProjects.map((deadline) => {
                                        return (
                                            <div
                                                key={deadline?.project_id}
                                                className={`border-2 rounded-lg p-3 hover:shadow-md transition-shadow ${getUrgencyColor(deadline?.deadline.daysRemaining)}`}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-sm truncate">{deadline?.deadline?.title}</h3>
                                                        <h5 className="font-semibold text-sm truncate">{deadline?.deadline?.requirement}</h5>
                                                        <p className="text-xs opacity-80 truncate">{deadline?.project_name}</p>

                                                    </div>
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <div className="text-right">
                                                            <p className="text-xs opacity-70">{deadline?.deadline?.date}</p>
                                                            <span className="text-xs font-medium">
                                                                {`${deadline?.deadline.daysRemaining}d left`}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedDeadline(deadline)}
                                                            className="flex items-center gap-1 px-2 py-1 bg-white/50 text-current text-xs font-medium rounded hover:bg-white/80 transition-colors"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        }

                        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/20 rounded-lg border border-primary p-5 mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2">
                                <div>
                                    <div className="flex flex-row items-center gap-4 mb-4">

                                        <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 " />
                                        <h3 className="font-semibold text-slate-900">Tips & Recommended Actions</h3>
                                    </div>
                                    <div className="space-y-2 text-sm text-slate-700 mb-4">

                                        <div className="flex items-start gap-2">
                                            <span className="text-red-600">•</span>
                                            <p><strong>Action Required:</strong> You currently have {stats.overdueProjects} overdue deadline{stats.overdueProjects !== 1 ? 's' : ''}. Please review and resolve them promptly to avoid potential risks.</p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <span className="text-primary">•</span>
                                            <p><strong>Reminder Setup:</strong> Schedule email notifications 7–14 days in advance for critical deadlines to stay well-prepared.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600">•</span>
                                            <p><strong>Proactive Review:</strong> Go through project details and confirm recipient information early to prevent last-minute issues.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-indigo-600">•</span>
                                            <p><strong>Record Keeping:</strong> Maintain copies of all submitted documents and track delivery confirmations for compliance and reference.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-auto flex flex-wrap flex-col sm:flex-row lg:flex-col gap-2 border-t lg:border-t-0 lg:border-l border-blue-200 pt-4 lg:pt-0 lg:pl-4">
                                    <button
                                        onClick={() => navigate("/documents")}
                                        className="w-full  flex items-center justify-center  gap-1.5 
                                            px-3 py-2 sm:py-1.5 
                                            bg-white text-primary text-xs sm:text-sm font-medium 
                                            rounded-lg hover:bg-blue-100 transition-colors 
                                            border border-blue-300"
                                    >
                                        <FileText className="w-4 sm:w-3.5 h-4 sm:h-3.5" />
                                        Review Documents
                                    </button>
                                    <button
                                        onClick={
                                            () => navigate("/tasks")
                                        }
                                        className="w-full flex items-center justify-center  gap-1.5 
                                            px-3 py-2 sm:py-1.5 
                                            bg-white text-primary text-xs sm:text-sm font-medium 
                                            rounded-lg hover:bg-blue-100 transition-colors 
                                            border border-blue-300"
                                    >
                                        <CheckSquare className="w-4 sm:w-3.5 h-4 sm:h-3.5" />
                                        View All Tasks
                                    </button>
                                    <button
                                        onClick={() => navigate("/contacts")}
                                        className="w-full flex items-center justify-center  gap-1.5 
                                            px-3 py-2 sm:py-1.5 
                                            bg-white text-primary text-xs sm:text-sm font-medium 
                                            rounded-lg hover:bg-blue-100 transition-colors 
                                            border border-blue-300"
                                    >
                                        <Users className="w-4 sm:w-3.5 h-4 sm:h-3.5" />
                                        Verify Contacts
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            )}
            {
                selectedDeadline !== null &&
                <DeadlineViewModal isOpen={selectedDeadline !== null} onClose={() => setSelectedDeadline(null)} data={selectedDeadline} />
            }
        </div >
    )
}

export default DeadlineScreen