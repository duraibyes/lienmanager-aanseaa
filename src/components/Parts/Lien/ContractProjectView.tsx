import { ProjectViewResponse } from "../../../types/project"
import { formatDate } from "../../../utils/common"

const ContractProjectView = ({ project }: { project: ProjectViewResponse | null }) => {

    return (
        <div className="space-y-4">
            {!project?.contracts ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500">No contracts available</p>
                </div>
            ) :
                project.contracts && (
                    <div key={project.contracts.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{project.contracts.jobProjectNumber}</h3>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${String(project?.status) === '1' ? 'bg-green-100 text-green-800' :
                                    String(project?.status) === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                        String(project?.status) === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {String(project?.status) === '1' ? 'Executed' : 'N/A'}
                                </span>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    ${(Number(project.contracts.baseContractAmount) + Number(project?.contracts?.additionalCosts))?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {project?.signatureDate && (

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Signed Date</p>
                                    <p className="text-sm text-gray-900">{formatDate(project?.signatureDate)}</p>
                                </div>
                            )}
                            {project?.startDate && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Effective Date</p>
                                    <p className="text-sm text-gray-900">{formatDate(project?.startDate)}</p>
                                </div>
                            )}
                            {project?.endDate && (

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Completion Date</p>
                                    <p className="text-sm text-gray-900">{formatDate(project?.endDate)}</p>
                                </div>
                            )}
                        </div>
                        {project?.contracts?.materialServicesDescription && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">{project?.contracts?.materialServicesDescription}</p>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    )
}

export default ContractProjectView