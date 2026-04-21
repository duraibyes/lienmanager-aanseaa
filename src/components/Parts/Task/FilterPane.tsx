import { useMemo, useCallback } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { useGetTaskActionsQuery } from "../../../features/task/taskDataApi";

type FilterPaneProps = {
  search: string;
  setSearch: (search: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
};

const H = "h-[38px]";

function Divider() {
  return <div className="w-px h-5 bg-slate-200 flex-shrink-0 mx-1" />;
}

const FilterPane = ({
  filterStatus,
  setFilterStatus,
  search,
  setSearch,
}: FilterPaneProps) => {
  const { data: taskActionData } = useGetTaskActionsQuery();

  const hasActiveFilters = filterStatus !== "all" || search !== "";

  const activeCount = useMemo(() => {
    let n = 0;
    if (search !== "") n++;
    if (filterStatus !== "all") n++;
    return n;
  }, [search, filterStatus]);

  const handleClear = useCallback(() => {
    setSearch("");
    setFilterStatus("all");
  }, [setSearch, setFilterStatus]);

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center gap-2 flex-wrap bg-primary/5 rounded-2xl border border-slate-100 shadow-sm px-4 py-2.5">

        <div className="relative group w-full md:w-1/2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project, task, or contact..."
            className="w-full pl-12 pr-12 py-2 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-input outline-none transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <Divider />

        <div className={`relative flex items-center ${H} min-w-[180px]`}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`appearance-none w-full ${H} pl-3 pr-8 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-input focus:border-primary cursor-pointer transition-colors`}
          >
            <option value="all">All Task Actions</option>
            {taskActionData?.data.map((action: any) => (
              <option key={action.id} value={action.id}>
                {action.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        {hasActiveFilters && (
          <>
            <Divider />
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 border border-primary hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          </>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400 font-medium">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary-gradient"
          />
          {activeCount} filter{activeCount > 1 ? "s" : ""} active
        </div>
      )}
    </div>
  );
};

export default FilterPane;