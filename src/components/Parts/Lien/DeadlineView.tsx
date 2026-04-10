import { AlertCircle, Calendar, CheckCircle } from "lucide-react";
import { formatDate } from "../../../utils/common";
import { CalculatedDeadline } from "../../../types/deadline";

const DeadlineView = ({ deadlines }: { deadlines: CalculatedDeadline[] }) => {
    return (
        <div className="space-y-3">
            {deadlines.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500">No deadlines set</p>
                </div>
            ) : (
                deadlines.map((deadline, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className={`p-2 rounded-lg ${deadline.is_late ? 'bg-red-100' : 'bg-green-100'
                                    }`}>
                                    {!deadline.is_late ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-orange-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-medium text-gray-900">{deadline.title}</h3>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                            {deadline.requirement}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{formatDate(deadline.date)}</span>
                                        {/* {deadline.completed_date && (
                                            <>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-sm text-green-600">
                                                    Completed {formatDate(deadline.completed_date)}
                                                </span>
                                            </>
                                        )} */}
                                    </div>
                                    {/* {deadline.notes && (
                                        <p className="text-sm text-gray-600 mt-2">{deadline.notes}</p>
                                    )} */}
                                </div>
                            </div>
                            <div className="flex sm:block">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${deadline.is_late ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'

                                    }`}>
                                    {deadline.daysRemaining} {deadline.is_late ? 'Overdue' : 'Remaining'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default DeadlineView