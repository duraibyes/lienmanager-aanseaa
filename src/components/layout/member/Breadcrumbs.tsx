import { Link, useLocation, useNavigate } from "react-router-dom";
import { breadcrumbMap } from "../../../utils/breadcrum";
import { Plus } from "lucide-react";
import { handleAddProject } from "../../../utils/navigation";

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeMap: Record<string, string> = {
    project: "/projects",
  };

  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <div className="text-sm text-slate-500 flex items-center justify-between gap-2 px-4 sm:px-8 py-2.5 bg-slate-100 shadow-md">
      <div className="flex items-center gap-2">

        <Link to="/dashboard" className="hover:text-primary">
          Home
        </Link>

        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;

          if (!isNaN(Number(value))) return null;

          const rawPath = "/" + pathnames.slice(0, index + 1).join("/");

          const to = routeMap[value] || rawPath;

          const label =
            breadcrumbMap[value] ||
            value.charAt(0).toUpperCase() + value.slice(1);

          console.log('  label ', label)
          if (label.toLowerCase() === 'home') return null;

          return (
            <span key={to} className="flex items-center gap-2">
              <span>/</span>

              {isLast ? (
                <span className="text-slate-900 font-medium">{label}</span>
              ) : (
                <Link to={to} className="font-semibold text-primary hover:text-underline-offset-4 decoration-2 hover:text-primary">
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </div>
      <div>
        <button
          onClick={() => handleAddProject(navigate)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-[#005a92] rounded-xl font-semibold shadow-md hover:scale-105 transition-all duration-300 text-sm md:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">New Project</span>
        </button>
      </div>
    </div>
  );
};

export default Breadcrumbs;