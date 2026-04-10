import { RemedyDateType } from "../../../types/date";
import { formatDate } from "../../../utils/common";

type Props = {
    dates: RemedyDateType[];
    startDate: string;
    endDate: string;
    selectedDate: any;
}
const ProjectDatesView = ({dates, startDate, endDate, selectedDate}: Props) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="text-base text-gray-900">{formatDate(startDate)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="text-base text-gray-900">{formatDate(endDate)}</p>
                </div>
                 {dates && dates.length > 0 && dates?.map((date) => (

                    <div key={date.id}>
                        <p className="text-sm text-gray-600 mb-1">{date.name}</p>
                        <p className="text-base text-gray-900">{selectedDate[date.id] ? formatDate(selectedDate[date.id]) : 'N/A'}</p>
                    </div>
                 ))}
            </div>
        </div>
    )
}

export default ProjectDatesView