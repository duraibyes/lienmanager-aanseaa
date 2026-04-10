import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ExternalLink, Mail, X } from "lucide-react";
import { useGetTaskByIdQuery } from "../../../features/task/taskDataApi";
import { handleViewProject } from "../../../utils/navigation";

type TaskViewProps = {
    taskId: number;
    onClose: () => void;
}

const TaskView = ({ taskId, onClose }: TaskViewProps) => {
    const navigate = useNavigate();
    const { data: taskDetail, isLoading: detailLoading } = useGetTaskByIdQuery(taskId);

    const getDaysUntilDue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (detailLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-3xl w-full p-6">
                    <p className="text-center text-slate-500">Loading task details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Task Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Task Information</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Action</p>
                                <p className="text-lg font-semibold text-slate-900">{taskDetail?.data?.action_type?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Project</p>
                                {taskDetail?.data?.project ? (
                                    <button
                                        onClick={() => handleViewProject(navigate, taskDetail?.data?.project?.id)}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                                    >
                                        {taskDetail?.data?.project?.project_name}
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <p className="text-slate-900 font-medium">{taskDetail?.data?.project?.project_name || 'N/A'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Timeline</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-500">Due Date</p>
                                    <p className="text-slate-900 font-medium">
                                        {new Date(taskDetail?.data?.due_date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-500">Time Until Due</p>
                                    {(() => {
                                        const days = getDaysUntilDue(taskDetail?.data?.due_date);
                                        if (days < 0) {
                                            return (
                                                <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                                    {Math.abs(days)} days overdue
                                                </span>
                                            );
                                        } else if (days === 0) {
                                            return (
                                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                                    Due today
                                                </span>
                                            );
                                        } else if (days <= 7) {
                                            return (
                                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                                    {days} days remaining (Urgent)
                                                </span>
                                            );
                                        } else {
                                            return (
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    {days} days remaining
                                                </span>
                                            );
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Task User Details</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Assigned To</p>
                                <p className="text-lg font-semibold text-slate-900">{taskDetail?.data?.assigned_to_user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Assigned By</p>
                                <p className="text-lg font-semibold text-slate-900">{taskDetail?.data?.assigned_by_user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Assigned At</p>
                                <p className="text-lg font-semibold text-slate-900">{taskDetail?.data?.assigned_at}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Notifications</h4>
                        <div className="flex items-center gap-3">
                            {taskDetail?.data?.email_alert ? (
                                <>
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <p className="text-slate-900">Email alerts enabled</p>
                                </>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5 text-slate-400" />
                                    <p className="text-slate-500">Email alerts disabled</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-200">
                        Created on {new Date(taskDetail?.data?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskView