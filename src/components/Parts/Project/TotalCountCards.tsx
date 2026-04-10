import { Calendar, CheckSquare, FileText, FolderOpen } from "lucide-react";
import { useGetProjectStatusCountQuery } from "../../../features/project/projectDataApi";

const TotalCountCards = () => {
  const { data, isFetching } = useGetProjectStatusCountQuery();

  const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
  const secondaryGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

  const Card = ({ title, value, icon: Icon }) => (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md h-[60px] sm:h-[64px] w-full min-w-0">
      {/* Icon Container */}
      <div
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white shrink-0"
        style={{ background: primaryGradient }}
      >
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
      </div>

      {/* Text Container */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <p
          className="text-lg sm:text-xl font-extrabold leading-none"
          style={{
            backgroundImage: secondaryGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {isFetching ? (
            <span className="inline-block w-8 h-5 bg-slate-100 animate-pulse rounded" />
          ) : (
            value || 0
          )}
        </p>
        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-tight lg:whitespace-nowrap">
          {title}
        </p>
      </div>
    </div>
  );

  return (
    /* Mobile: grid-cols-2 (2x2 layout)
       lg: Single row.
       xl: Added to ensure enough room for full text on large screens
    */
    <div className="grid grid-cols-2 lg:flex lg:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
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