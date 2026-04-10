import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useGetTaskStatusCountQuery } from "../../../features/task/taskDataApi";

const TotalCountCards = () => {
  const { data, isFetching } = useGetTaskStatusCountQuery();

  // Design tokens synchronized with Project Dashboard
  const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
  const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

  const Card = ({ title, value, icon: Icon, isOverdue = false }) => (
    <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm self-start sm:self-auto transition-all hover:shadow-md">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
        style={{ background: isOverdue ? 'linear-gradient(-30deg, #ef4444, #f87171 100%)' : primaryGradient }}
      >
        <Icon className="w-4 h-4" /> 
      </div>
      <div>
        <p
          className="text-xl font-extrabold leading-none"
          style={{
            backgroundImage: isOverdue ? 'linear-gradient(-30deg, #991b1b, #ef4444 100%)' : secondaryGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {isFetching ? (
            <span className="inline-block w-6 h-4 bg-slate-100 animate-pulse rounded" />
          ) : (
            value || 0
          )}
        </p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
          {title}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Card 
        title="Total Tasks" 
        value={data?.data?.total_count} 
        icon={CheckCircle2} 
      />
      <Card 
        title="Upcoming (7 days)" 
        value={data?.data?.upcoming_count} 
        icon={Clock} 
      />
      <Card 
        title="Overdue" 
        value={data?.data?.overdue_count} 
        icon={AlertCircle}
        isOverdue={Number(data?.data?.overdue_count) > 0}
      />
    </div>
  );
};

export default TotalCountCards;