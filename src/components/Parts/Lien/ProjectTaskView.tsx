import { Calendar, CheckCircle } from 'lucide-react'
import { formatDate } from '../../../utils/common'

const ProjectTaskView = ({ tasks }: { tasks: any[] }) => {
    return (
        <div className="space-y-3">
            {tasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500">No tasks created</p>
                </div>
            ) : (
                tasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className={`p-2 rounded-lg ${task.status === 'Completed' ? 'bg-green-100' :
                                    task.status === 'In Progress' ? 'bg-blue-100' :
                                        task.status === 'Cancelled' ? 'bg-gray-100' :
                                            'bg-gray-50'
                                    }`}>
                                    <CheckCircle className={`w-5 h-5 ${task.status === 'Completed' ? 'text-green-600' :
                                        task.status === 'In Progress' ? 'text-blue-600' :
                                            'text-gray-400'
                                        }`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-medium text-gray-900">{task.task_name}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${task.priority === 'overdue' ? 'bg-red-100 text-red-800' :
                                            task.priority === 'near_due' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    {task.comment && (
                                        <p className="text-sm text-gray-600 mt-1">{task.comment}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Due: {formatDate(task.due_date)}</span>
                                        {task.complete_date && (
                                            <>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-sm text-green-600">
                                                    Completed {formatDate(task.complete_date)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex sm:block">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                        task.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default ProjectTaskView