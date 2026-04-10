import { Calendar } from "lucide-react";
import { RemedyDateType } from "../../types/date";
import { ProjectWizardData } from "../../types/project";

type RemedyDatesProps = {
    dates: RemedyDateType[];
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly data: ProjectWizardData;
}

const RemedyDates = ({ dates, onUpdate, data }: RemedyDatesProps) => {
    if (!dates?.length) return null;
    return (
        <>
            {dates?.map((date) => (
                <div key={date.id}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {date.name} <span className="text-red-600">*</span>
                    </label>

                    <div className="relative">
                        <input
                            type="date"
                            value={data.furnishingDates?.[date.id] || ""}
                            onChange={(e) =>
                                onUpdate({
                                    furnishingDates: {
                                        ...data.furnishingDates,
                                        [date.id]: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />

                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>

                    
                </div>
            ))}
        </>
    )
}

export default RemedyDates