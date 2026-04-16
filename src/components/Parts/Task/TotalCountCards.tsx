import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { useGetTaskStatusCountQuery } from "../../../features/task/taskDataApi";

const TotalCountCards = () => {

  const { data } = useGetTaskStatusCountQuery();

  const cardData = [
    {
      title: 'Total Tasks',
      value: Number(data?.data?.total_count) || 0,
      icon: CheckCircle2,
    },
    {
      title: 'Upcoming (7 days)',
      value: Number(data?.data?.upcoming_count) || 0,
      icon: Clock,
    },
    {
      title: 'Industry Contacts',
      value: Number(data?.data?.overdue_count) || 0,
      icon: AlertCircle,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {cardData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default TotalCountCards;