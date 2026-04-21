import { Calendar, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ProjectWizardData } from '../../../types/project';
import { CalculatedDeadline, DeadLineRequestType } from '../../../types/deadline';
import { useCalculateDeadlineMutation } from '../../../features/project/ProjectDeadlineApi';

interface DeadlinesStepProps {
    readonly data: ProjectWizardData;
    readonly onNext?: () => void;
    readonly onBack?: () => void;
    readonly onSaveAndExit?: () => void;
}

export default function DeadlinesStep({ data }: DeadlinesStepProps) {
    const [calculatedDeadlineData, setCalculatedDeadlineData] = useState<CalculatedDeadline[]>([]);

    const [
        calculatedDeadline, { isLoading: isCalculatingDeadline }
    ] = useCalculateDeadlineMutation();

    const doDeadlineCalculation = async () => {
        const payload: DeadLineRequestType = {
            role_id: data.roleId,
            state_id: data.stateId,
            project_type_id: data.projectTypeId,
            customer_id: data.customerTypeId,
            furnishing_dates: data.furnishingDates,
        };
        try {
            const response = await calculatedDeadline(payload).unwrap();

            if (response.data.deadlines) {
                setCalculatedDeadlineData(response?.data?.deadlines ?? []);
            }

        } catch (err) {

            const errorResponse = (err as any)?.data;

            let errorMessage = "Something went wrong";

            if (errorResponse?.errors) {
                const firstErrorKey = Object.keys(errorResponse.errors)[0];
                errorMessage = errorResponse.errors[firstErrorKey][0];
            } else if (errorResponse?.message) {
                errorMessage = errorResponse.message;
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    };

    useEffect(() => {
        doDeadlineCalculation()
    }, [])


    console.log(' calculatedDeadlineData ', calculatedDeadlineData);

    return (
        <div className="p-2">

            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 md:p-8">
                {isCalculatingDeadline && (
                    <div className="border-t border-slate-200 pt-6 flex justify-center py-6">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                            <span className="text-sm">Loading Dealines...</span>
                        </div>
                    </div>
                )}
                {((calculatedDeadlineData.length === 0 || data.furnishingDates.length === 0) && !isCalculatingDeadline) ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-primary/60 mx-auto mb-4" />
                        <p className="text-slate-600">  Deadlines will appear once you complete the Dates step </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4 overflow-auto max-h-[450px]">
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2'>

                            {Object.entries(data.furnishingDates).length > 0 && calculatedDeadlineData.map((deadline, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`shadow-sm rounded-md h-[220px] border border-1 border-primary/40 hover:shadow-lg`}
                                    >
                                        <div className="flex flex-col sm:items-start h-full sm:justify-between gap-3 sm:gap-4">

                                            <div className='p-4'>
                                                <h3 className="text-lg font-bold mb-1 ">{deadline.title}</h3>
                                                <p className="text-sm opacity-80 mb-2 ">{deadline.requirement}</p>
                                            </div>
                                            <div className={`flex w-full flex-col sm:flex-row items-center gap-4 hover:bg-primary/10 text-sm justify-center  sm:justify-between  font-semibold border border-t-4 ${deadline.is_late ? "border-t-primary" : "border-t-green-700 hover:bg-green-100"} rounded-md shadow-lg p-4`}>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {deadline.date}
                                                </div>
                                                <div>
                                                    {deadline.is_late
                                                        ? `${deadline.daysRemaining} days overdue`
                                                        : `${Math.abs(deadline.daysRemaining)} days remaining`
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="mt-6 bg-primary/5 border border-primary rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Important
                    </h3>
                    <p className="text-sm text-amber-800">
                        Deadlines shown are estimates and may vary. Please consult a qualified attorney for exact legal requirements in your state.
                    </p>
                </div>
            </div>
        </div>
    );
}
