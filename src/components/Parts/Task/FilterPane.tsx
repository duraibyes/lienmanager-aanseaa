import { useMemo, useCallback } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { useGetTaskActionsQuery } from "../../../features/task/taskDataApi";

type FilterPaneProps = {
  search: string;
  setSearch: (search: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
};

// ── Shared Design Tokens ──────────────────────────────────────────────────
const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
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
      {/* ── Main Bar ── */}
      <div className="flex items-center gap-2 flex-wrap bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-2.5">
        
        {/* Search Input */}
        <div className={`flex items-center gap-2 flex-1 min-w-[240px] ${H} px-3 bg-slate-50 border border-slate-100 rounded-xl`}>
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by project, customer, or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <Divider />

        {/* Task Action Select (Replacing State Select) */}
        <div className={`relative flex items-center ${H} min-w-[180px]`}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`appearance-none w-full ${H} pl-3 pr-8 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 cursor-pointer transition-colors`}
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

        {/* Clear Button — Only visible when active */}
        {hasActiveFilters && (
          <>
            <Divider />
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#0075be] bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          </>
        )}
      </div>

      {/* ── Active filter hint ── */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400 font-medium">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: primaryGradient }}
          />
          {activeCount} filter{activeCount > 1 ? "s" : ""} active
        </div>
      )}
    </div>
  );
};

export default FilterPane;