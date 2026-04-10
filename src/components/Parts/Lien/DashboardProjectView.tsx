import { CheckCircle, DollarSign, FileText } from "lucide-react"
import { ProjectViewResponse } from "../../../types/project"

const DashboardProjectView = ({project}:{project:ProjectViewResponse | null}) => {
    return (
        <div>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <p className="text-sm text-gray-600">Contracts</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{project?.contracts ? 1 : 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        ${project?.contracts?.baseContractAmount}
                    </p>
                </div>
                {/* <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-orange-600" />
                        <p className="text-sm text-gray-600">Deadlines</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{deadlines.filter(d => d.status === 'Upcoming').length}</p>
                </div> */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                        <p className="text-sm text-gray-600">Tasks</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{project?.tasks?.filter(t => t.status !== 'Completed').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Project Information</h2>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">Project Name</p>
                        <p className="text-lg font-semibold text-gray-900">{project?.projectName}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        {/* <div>
                            <p className="text-sm text-gray-600 mb-2">Client Company</p>
                            <p className="text-base text-gray-900">{project?.client_company || 'N/A'}</p>
                        </div> */}
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Customer Name</p>
                            <p className="text-base text-gray-900">{project?.customer_name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">State</p>
                            <p className="text-base text-gray-900">{project?.state || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Project Type</p>
                            <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {project?.projectType?.project_type || 'N/A'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Status</p>
                            <span
                                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${project?.status === 1
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {project?.status === 1 ? 'Active' : 'InActive'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Entry Date</p>
                            <p className="text-base text-gray-900">{project?.created_at}</p>
                        </div>
                    </div>

                    {/* <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Lien Provider</p>
                        {/* <p className="text-base text-gray-900">{project.lien_provider_name}</p> 
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default DashboardProjectView