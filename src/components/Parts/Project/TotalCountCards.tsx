import { Calendar, CheckSquare, FileText, FolderOpen } from "lucide-react";
import { useGetProjectStatusCountQuery } from "../../../features/project/projectDataApi";

const TotalCountCards = () => {

  const { data, isFetching } = useGetProjectStatusCountQuery();

  const Card = ({
    title,
    value,
    icon: Icon,
  }: {
    title: string;
    value: number | undefined;
    icon: React.ElementType;
  }) => (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-sm transition-all w-full h-[64px]">

      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-primary-gradient"
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex flex-col justify-center flex-1 overflow-hidden">

        <p className="text-lg sm:text-xl font-bold leading-tight truncate">
          {isFetching ? (
            <span className="inline-block w-10 h-5 bg-slate-200 animate-pulse rounded" />
          ) : (
            value ?? 0
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
        title="Total Projects"
        value={data?.data?.total}
        icon={FolderOpen}
      />
      <Card
        title="Active Projects"
        value={data?.data?.active}
        icon={CheckSquare}
      />
      <Card
        title="Pending Tasks"
        value={data?.data?.inprogress}
        icon={Calendar}
      />
      <Card
        title="Completed"
        value={data?.data?.completed}
        icon={FileText}
      />
    </div>
  );
};

export default TotalCountCards; 