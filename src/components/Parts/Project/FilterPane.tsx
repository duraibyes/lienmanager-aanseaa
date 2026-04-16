import { SetStateAction, useCallback, useMemo } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { State } from "../../../types/master";
interface FilterProps {
  search: string;
  statusFilter: string;
  stateFilter: string;
  setSearch: React.Dispatch<SetStateAction<string>>;
  setStateFilter: React.Dispatch<SetStateAction<string>>;
  setStatusFilter: React.Dispatch<SetStateAction<string>>;
  stateData: State[];
}

// ── Shared input/control height so every element sits on the same baseline ──
const H = "h-[38px]";

// ── Thin vertical rule between control groups ─────────────────────────────
function Divider() {
  return <div className="w-px h-5 bg-slate-200 flex-shrink-0" />;
}

export default function FilterPane({
  search,
  statusFilter,
  stateFilter,
  setSearch,
  setStateFilter,
  setStatusFilter,
  stateData,
}: FilterProps) {
  const hasActiveFilters =
    stateFilter !== "all" || statusFilter !== "all" || search !== "";

  const activeCount = useMemo(() => {
    let n = 0;
    if (search !== "") n++;
    if (statusFilter !== "all") n++;
    if (stateFilter !== "all") n++;
    return n;
  }, [search, statusFilter, stateFilter]);

  const handleClear = useCallback(() => {
    setSearch("");
    setStateFilter("all");
    setStatusFilter("all");
  }, []);

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
  ] as const;

  return (
    <div className="flex flex-col gap-2">

      {/* ── Bar ── */}
      <div className="flex items-center gap-2 flex-wrap bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-2.5">

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, customers…"
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

        <div className="flex items-center gap-0.5 p-0.5 bg-slate-50 border border-slate-100 rounded-xl">
          {statusOptions.map(({ value, label }) => {
            const active = statusFilter === value;
            return (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3.5 py-1.5 rounded-[9px] text-xs font-semibold transition-all duration-150 whitespace-nowrap ${active
                  ? "bg-white text-primary border border-slate-200 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <Divider />

        {/* State dropdown */}
        <div className={`relative flex items-center ${H}`}>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className={`appearance-none ${H} pl-3 pr-8 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 cursor-pointer transition-colors`}
          >
            <option value="all">All states</option>
            {stateData?.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Clear — only when active */}
        {hasActiveFilters && (
          <>
            <Divider />
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 border border-border-primary/10 hover:bg-primary/30 transition-colors whitespace-nowrap"
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
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary-gradient"
          />
          {activeCount} filter{activeCount > 1 ? "s" : ""} active
        </div>
      )}

    </div>
  );
}