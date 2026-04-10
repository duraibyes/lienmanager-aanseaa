import { ArrowLeft, Building, Calendar, DollarSign, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProjectInfoQuery } from "../../features/project/projectDataApi";
import { TaskViewResponse } from "../../types/project";


const ProjectViewScreen = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const { data: project } = useGetProjectInfoQuery(
        { projectId: Number(projectId) },
        { skip: !projectId }
    );
    
    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    {project?.data?.projectName}
                </h1>
                <div className="flex items-center gap-3">
                    {(() => {
                        const status = project?.data?.status;
                        let statusClass = 'bg-blue-100 text-blue-800';
                        if (status === 1) {
                            statusClass = 'bg-green-100 text-green-800';
                        } else if (status === 0) {
                            statusClass = 'bg-yellow-100 text-yellow-800';
                        }
                        return (
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
                            >
                                {status === 1 ? 'Active' : 'InActive'}
                            </span>
                        );
                    })()}
                </div>
            </div>

            <div className="space-y-4 md:space-y-6">
                <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        Project Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Project Type</label>
                            <p className="text-slate-900 capitalize">{project?.data?.projectType?.project_type || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Role</label>
                            <p className="text-slate-900 capitalize">{project?.data?.projectRole?.project_role || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Customer Type</label>
                            <p className="text-slate-900 capitalize">{project?.data?.customerType || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Location State</label>
                            <p className="text-slate-900">{project?.data?.state || 'N/A'}</p>
                        </div>
                    </div>
                </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Job Site Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Job Name</label>
                            <p className="text-slate-900">{project?.data?.jobName || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Job Address</label>
                            <p className="text-slate-900">{project?.data?.jobAddress || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">City</label>
                            <p className="text-slate-900">{project?.data?.jobCity || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">State</label>
                            <p className="text-slate-900">{project?.data?.state || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">ZIP Code</label>
                            <p className="text-slate-900">{project?.data?.jobZip || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Country</label>
                            <p className="text-slate-900">{project?.data?.country || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Financial Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Contract Amount</label>
                            <p className="text-slate-900 text-xl md:text-2xl font-bold text-green-600">
                                ${project?.data?.contracts?.total_claim_amount.toLocaleString() || '0'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Base Contract Amount</label>
                            <p className="text-slate-900">
                                ${project?.data?.contracts?.baseContractAmount?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Additional Costs</label>
                            <p className="text-slate-900">
                                ${project?.data?.contracts?.additionalCosts?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Payments/Credits</label>
                            <p className="text-slate-900">
                                ${project?.data?.contracts?.paymentsCredits?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Unpaid Balance</label>
                            <p className="text-slate-900 text-base md:text-lg font-semibold text-red-600">
                                ${project?.data?.contracts?.total_claim_amount?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                 <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Timeline
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600">Start Date</label>
                            <p className="text-slate-900">
                                {project?.data?.startDate
                                    ? new Date(project?.data?.startDate).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600">End Date</label>
                            <p className="text-slate-900">
                                {project?.data?.endDate ? new Date(project?.data?.endDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        {/* <div>
                            <label className="text-sm font-semibold text-slate-600">Completion Date</label>
                            <p className="text-slate-900">
                                {project.completion_date
                                    ? new Date(project.completion_date).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div> */}
                    </div>
                </div>

                {project?.data?.tasks && project?.data?.tasks.length > 0 && (
                    <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4">Tasks ({project?.data?.tasks.length})</h2>
                        <div className="space-y-2">
                            {project?.data?.tasks.map((task: TaskViewResponse) => (
                                <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">{task.actionType}</p>
                                        <p className="text-sm text-slate-600">
                                            Due: {task?.due_date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )} 
            </div>

            <div className="mt-6 md:mt-8">
                <button
                    onClick={() => navigate("/projects")}
                    className="w-full md:w-auto px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>
            </div>
        </div>
    )
}

export default ProjectViewScreen