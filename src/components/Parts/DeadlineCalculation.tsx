import { CalculatedDeadline } from "@/types/deadline";
import { Calculator, Info } from "lucide-react";


type DeadlineCalculationProps = {
    calculateLoading: boolean;
    calculatedDeadlineData: CalculatedDeadline[];
}

const DeadlineCalculation = ({
    calculateLoading,
    calculatedDeadlineData,
}: DeadlineCalculationProps) => {
    const getStatus = (days: number) => {
        if (days > 30) return "CRITICAL";
        if (days > 0) return "UPCOMING";
        return "OVERDUE";
    };

    const getStyles = (days: number) => {
        if (days > 30)
            return {
                border: "border-green-300",
                badge: "bg-green-100 text-green-700",
                iconBg: "bg-green-100",
                line: "bg-green-400",
                text: "text-green-700",
            };

        if (days > 0)
            return {
                border: "border-amber-300",
                badge: "bg-amber-100 text-amber-700",
                iconBg: "bg-amber-100",
                line: "bg-amber-400",
                text: "text-amber-700",
            };

        return {
            border: "border-red-300",
            badge: "bg-red-100 text-red-700",
            iconBg: "bg-red-100",
            line: "bg-red-400",
            text: "text-red-700",
        };
    };

    return (
        <div className="space-y-8">
            {/* 🔄 Loading */}
            {calculateLoading ? (
                <div className="bg-white rounded-2xl border p-10 text-center shadow-sm">
                    <Calculator className="w-14 h-14 text-primary mx-auto mb-4 animate-pulse" />
                    <h3 className="text-xl font-semibold mb-2">
                        Calculating your deadlines...
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Please wait while we analyze your project details and generate
                        accurate deadline insights.
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline vertical line */}
                    <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-slate-200" />

                    <div className="space-y-8">
                        {calculatedDeadlineData?.map((deadline, index) => {
                            const styles = getStyles(deadline.daysRemaining);
                            const status = getStatus(deadline.daysRemaining);

                            return (
                                <div key={index} className="relative flex gap-6">
                                    {/* Timeline Icon */}
                                    <div className="relative z-10">
                                        <div
                                            className={`w-10 h-10 flex items-center justify-center rounded-full border ${styles.iconBg}`}
                                        >
                                            <Info className={`w-5 h-5 ${styles.text}`} />
                                        </div>
                                    </div>

                                    {/* Card */}
                                    <div
                                        className={`flex-1 bg-white border ${styles.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            {/* Left Content */}
                                            <div>
                                                <span
                                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${styles.badge}`}
                                                >
                                                    {status} DEADLINE
                                                </span>

                                                <h3 className="text-lg font-semibold mt-2">
                                                    {deadline.title}
                                                </h3>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    This is your critical deadline to secure your right to
                                                    payment.
                                                </p>
                                            </div>

                                            {/* Right Date Section */}
                                            <div className="text-left md:text-right">
                                                <div
                                                    className={`text-2xl font-bold ${styles.text}`}
                                                >
                                                    {deadline.date}
                                                </div>

                                                <div className="mt-1 inline-block text-xs px-3 py-1 rounded-full bg-slate-900 text-white">
                                                    {deadline.daysRemaining > 0
                                                        ? `${deadline.daysRemaining} days remaining`
                                                        : `${Math.abs(
                                                            deadline.daysRemaining
                                                        )} days overdue`}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Requirement */}
                                        <div className="mt-4 text-sm text-slate-600 border-t pt-3">
                                            <span className="font-semibold">Requirement:</span>{" "}
                                            {deadline.requirement}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeadlineCalculation;