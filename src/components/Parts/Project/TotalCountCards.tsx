import { Calendar, CheckSquare, FileText, FolderOpen } from "lucide-react";
import { useGetProjectStatusCountQuery } from "../../../features/project/projectDataApi";
import { StatCard } from "@/components/ui/stat-card";

const TotalCountCards = () => {

  const { data } = useGetProjectStatusCountQuery();

  const cardData = [
    {
      title: 'Total Projects',
      value: data?.data?.total || 0,
      icon: FolderOpen,

    },
    {
      title: 'Active Projects',
      value: data?.data?.active || 0,
      icon: CheckSquare,

    },
    {
      title: 'Pending Tasks',
      value: data?.data?.inprogress || 0,
      icon: Calendar,

    },
    {
      title: 'Completed',
      value: data?.data?.completed || 0,
      icon: FileText,

    },
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