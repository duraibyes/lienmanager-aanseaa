import { Users } from "lucide-react"

type TotalContactCardProps = {
    totalCount: number;
    customerContactCount: number;
    projectContactCount: number;
    isLoading: boolean;
}

const TotalContactCard = (props: TotalContactCardProps) => {
    const renderCount = (value: number) =>
        props.isLoading ? (
            <span className="inline-block w-8 h-4 bg-slate-200 rounded animate-pulse"></span>
        ) : value;
        
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

            {/* Total Contacts */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 flex items-center gap-4">
                <Users className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                    <p className="text-sm text-slate-600">Total Contacts</p>
                    <p className="text-2xl font-bold text-slate-900">
                        {renderCount(props.totalCount)}
                    </p>
                </div>
            </div>

            {/* Customer Contacts */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 flex items-center gap-4">
                <Users className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                    <p className="text-sm text-slate-600">Customer Contacts</p>
                    <p className="text-2xl font-bold text-slate-900">
                        {renderCount(props.customerContactCount)}
                    </p>
                </div>
            </div>

            {/* Industry Contacts */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 flex items-center gap-4">
                <Users className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                    <p className="text-sm text-slate-600">Industry Contacts</p>
                    <p className="text-2xl font-bold text-slate-900">
                        {renderCount(props.projectContactCount)}
                    </p>
                </div>
            </div>

        </div>
    )
}

export default TotalContactCard