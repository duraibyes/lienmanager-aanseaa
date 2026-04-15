import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useGetTaskStatusCountQuery } from "../../../features/task/taskDataApi";

const TotalCountCards = () => {

  const { data, isFetching } = useGetTaskStatusCountQuery();

  const Card = ({ title, value, icon: Icon, isOverdue = false }: { title: string; value: number | undefined; icon: typeof CheckCircle2; isOverdue?: boolean }) => (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-sm transition-all w-full h-[64px]">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-primary-gradient"
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p
          className={`text-lg sm:text-xl ${isOverdue ? 'text-red-600' : ''} font-bold leading-tight truncate`}

        >
          {isFetching ? (
            <span className="inline-block w-6 h-4 bg-slate-100 animate-pulse rounded" />
          ) : (
            value || 0
          )}
        </p>
        <p className="text-sm text-slate-500 truncate">
          {title}
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
      <Card
        title="Total Tasks"
        value={Number(data?.data?.total_count)}
        icon={CheckCircle2}
      />
      <Card
        title="Upcoming (7 days)"
        value={Number(data?.data?.upcoming_count)}
        icon={Clock}
      />
      <Card
        title="Overdue"
        value={Number(data?.data?.overdue_count)}
        icon={AlertCircle}
        isOverdue={Number(data?.data?.overdue_count) > 0}
      />
    </div>
  );
};

export default TotalCountCards;