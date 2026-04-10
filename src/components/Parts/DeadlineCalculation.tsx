import { Calculator, Info } from "lucide-react"
import { CalculatedDeadline } from "../../types/deadline";

type DeadlineCalculationProps = {
    calculateLoading: boolean;
    calculatedDeadlineData: CalculatedDeadline[];
}

const DeadlineCalculation = ({ calculateLoading, calculatedDeadlineData }: DeadlineCalculationProps) => {
    return (
        <div className="space-y-6">
            {calculateLoading ? (
                <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
                    <Calculator className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2"> Calculating...</h3>
                    <p className="text-slate-600">
                        Fill in the project details on the left and click "Calculate Deadlines" to see your critical filing deadlines and recommended actions.
                    </p>
                </div>
            ) : calculatedDeadlineData?.map((deadline, index) => (
                <div key={index} className={`bg-gradient-to-br ${deadline.daysRemaining > 30 ? 'from-green-50 to-green-100 border-green-200' : deadline.daysRemaining > 0 ? 'from-amber-50 to-amber-100 border-amber-200' : 'from-red-50 to-red-100 border-red-200'} border rounded-lg p-6 shadow-sm`}>
                    <div className="flex items-start gap-3 mb-4">
                        <div className={`p-2 ${deadline.daysRemaining > 30 ? 'bg-green-200' : deadline.daysRemaining > 0 ? 'bg-amber-200' : 'bg-red-200'} rounded-lg`}>
                            <Info className={`w-5 h-5 ${deadline.daysRemaining > 30 ? 'text-green-700' : deadline.daysRemaining > 0 ? 'text-amber-700' : 'text-red-700'}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-lg font-semibold mb-1 ${deadline.daysRemaining > 30 ? 'text-green-900' : deadline.daysRemaining > 0 ? 'text-amber-900' : 'text-red-900'}`}>
                                {deadline.title}
                            </h3>
                            <p className={`text-sm ${deadline.daysRemaining > 30 ? 'text-green-700' : deadline.daysRemaining > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                                This is your critical deadline to secure your right to payment.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-3">
                        <div className={`text-3xl font-bold mb-2 ${deadline.daysRemaining > 30 ? 'text-green-700' : deadline.daysRemaining > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                            {deadline.date}
                        </div>
                        <div className="inline-block px-3 py-1 bg-slate-900 text-white text-sm font-medium rounded">
                            {deadline.daysRemaining > 0 ? `${deadline.daysRemaining} days remaining` : `${Math.abs(deadline.daysRemaining)} days overdue`}
                        </div>
                    </div>

                    <p className={`text-sm font-medium ${deadline.daysRemaining > 30 ? 'text-green-800' : deadline.daysRemaining > 0 ? 'text-amber-800' : 'text-red-800'}`}>
                        <span className="font-semibold">Requirement:</span> {deadline.requirement}
                    </p>
                </div>

            ))
            }
        </div>
    )
}

export default DeadlineCalculation