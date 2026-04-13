import { useCallback, useEffect, useState } from 'react';
import { Calculator, Calendar, Info, Globe, MapPin, Briefcase, Loader2, RefreshCcw } from 'lucide-react';
import Swal from 'sweetalert2';
import { useGetCountriesQuery, useGetProjectRolesQuery, useGetProjectTypesQuery, useGetStatesQuery, useLazyGetCustomerTypesQuery } from '../../features/master/masterDataApi';
import { useGetRemedyDatesQuery } from '../../features/project/projectDataApi';
import { CalculatedDeadline, DeadLineRequestType } from '../../types/deadline';
import { useCalculateDeadlineMutation } from '../../features/project/ProjectDeadlineApi';
import DeadlineCalculation from '../Parts/DeadlineCalculation';

const primaryGradient = "linear-gradient(-30deg, #0075be, #00aeea 100%)";
const darkGradient = "linear-gradient(-30deg, #334756, #003F58 100%)";

export default function QuickRemediesScreen() {
  const [countryId, setCountryId] = useState(0);
  const [projectState, setProjectState] = useState(0);
  const [role, setRole] = useState(0);
  const [contractType, setContractType] = useState(0);
  const [projectType, setProjectType] = useState(0);
  const [furnishingDates, setFurnishingDates] = useState<Record<number, string>>({});
  const [calculatedDeadlineData, setCalculatedDeadlineData] = useState<CalculatedDeadline[]>([]);

  // Logic Constants
  const shouldFetchRemedyDates = projectState && projectType && role && contractType;

  // Queries
  const { data: typesRes, isFetching: isTypeFetching } = useGetProjectTypesQuery();
  const { data: rolesRes, isFetching: isRoleFetching } = useGetProjectRolesQuery();
  const { data: countriesRes } = useGetCountriesQuery(undefined, { refetchOnFocus: false, refetchOnReconnect: false });
  const { data: states, isFetching: isStatesFetching } = useGetStatesQuery({ country_id: Number(countryId) }, { skip: !countryId });
  const [triggerCustomerTypes, { data: customerTypesRes, isFetching: isCustomerLoading }] = useLazyGetCustomerTypesQuery();
  const { data: datesRes } = useGetRemedyDatesQuery(
    { state_id: projectState, project_type_id: projectType, role_id: role, customer_type_id: contractType },
    { skip: !shouldFetchRemedyDates, refetchOnMountOrArgChange: true }
  );
  const [calculatedDeadline, { isLoading: calculateLoading }] = useCalculateDeadlineMutation();

  // Actions
  const doDeadlineCalculation = async () => {
    const payload: DeadLineRequestType = { role_id: role, state_id: projectState, project_type_id: projectType, customer_id: contractType, furnishing_dates: furnishingDates };
    try {
      const response = await calculatedDeadline(payload).unwrap();
      if (response.data.deadlines) setCalculatedDeadlineData(response?.data?.deadlines ?? []);
    } catch (err) {
      const errorResponse = (err as any)?.data as any;
      let errorMessage = errorResponse?.message || "Something went wrong";
      if (errorResponse?.errors) errorMessage = "Unknown error, please try some times";
      Swal.fire({ icon: "error", title: "Error", text: errorMessage });
    }
  };

  const handleReset = useCallback(() => {
    setProjectState(0); setRole(0); setContractType(0); setProjectType(0);
    setFurnishingDates({}); setCalculatedDeadlineData([]);
  }, []);

  const handleFurnishingDate = useCallback((id: number, value: string) => {
    setFurnishingDates((prev) => ({ ...prev, [id]: value }));
    setCalculatedDeadlineData([]);
  }, []);

  // Effects
  useEffect(() => {
    if (countriesRes?.data) {
      let usCountryId = countriesRes?.data?.find(c => c.name === 'United States')?.id || 0;
      setCountryId(usCountryId);
    }
  }, [countriesRes]);

  useEffect(() => {
    if (projectState && projectType && role) {
      triggerCustomerTypes({ state_id: projectState, project_type_id: projectType, role_id: role });
    }
  }, [projectState, projectType, role, triggerCustomerTypes]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quick Remedies Calculator</h1>
            <p className="text-slate-500 text-sm font-medium mt-1 max-w-xl">
              Calculate construction lien and bond claim deadlines instantly by providing the core project details below.
            </p>
          </div>
          {calculatedDeadlineData.length > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Reset Calculator
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Form Input */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: primaryGradient }}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Project Parameters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Country */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Project Country</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <select
                      value={countryId}
                      onChange={(e) => { setCountryId(Number(e.target.value)); setCalculatedDeadlineData([]); }}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none appearance-none"
                    >
                      {countriesRes?.data?.map((country) => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Project State</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <select
                      value={projectState}
                      onChange={(e) => { setProjectState(Number(e.target.value)); setCalculatedDeadlineData([]); }}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none appearance-none"
                    >
                      {isStatesFetching ? <option>Loading...</option> : (
                        <>
                          <option value="">Select State</option>
                          {states?.data?.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Your Professional Role</label>
                  <select
                    value={role}
                    onChange={(e) => { setRole(Number(e.target.value)); setCalculatedDeadlineData([]); }}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                  >
                    {isRoleFetching ? <option>Loading...</option> : (
                      <>
                        <option value="">Select Role</option>
                        {rolesRes?.data?.map((r) => <option key={r.id} value={r.id}>{r.project_role}</option>)}
                      </>
                    )}
                  </select>
                </div>

                {/* Project Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Project Classification</label>
                  <select
                    value={projectType}
                    onChange={(e) => { setProjectType(Number(e.target.value)); setCalculatedDeadlineData([]); }}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                  >
                    {isTypeFetching ? <option>Loading...</option> : (
                      <>
                        <option value="">Select Type</option>
                        {typesRes?.data?.map((t) => <option key={t.id} value={t.id}>{t.project_type}</option>)}
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Contract With Section */}
              <div className="mt-10 pt-8 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-4">Who is your contract with?</label>

                {isCustomerLoading ? (
                  <div className="flex items-center gap-2 text-slate-400 text-xs py-4"><Loader2 className="w-4 h-4 animate-spin" /> Fetching customer types...</div>
                ) : !customerTypesRes?.data ? (
                  <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-400 border border-dashed border-slate-200 text-center">
                    Select State, Role, and Type to view contract options
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {customerTypesRes.data.map((option) => (
                      <label
                        key={option.customer.id}
                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${contractType === option.customer.id ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
                      >
                        <input
                          type="radio"
                          name="customerType"
                          value={option.customer.id}
                          checked={contractType === option.customer.id}
                          onChange={(e) => setContractType(Number(e.target.value))}
                          className="mt-1.5 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-800">{option.customer.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{option.customer.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Important Dates Section */}
              {datesRes && datesRes.data.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-bold text-slate-800">Critical Furnishing Dates</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {datesRes.data.map((date) => (
                      <div key={date.id} className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-600 px-1 flex items-center gap-1.5">
                          {date.name} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={furnishingDates[date.id] || ""}
                            onChange={(e) => handleFurnishingDate(date.id, e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5 px-1">
                          <Info className="w-3 h-3" /> Select the date work or materials were first/last provided.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={doDeadlineCalculation}
                disabled={calculateLoading}
                className="w-full mt-10 py-4 text-white font-bold rounded-2xl shadow-xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: darkGradient }}
              >
                {calculateLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                Calculate Deadlines
              </button>
            </div>
          </div>

          {/* Right Column: Output / Results */}
          <div className="lg:col-span-5 sticky top-8">
            <DeadlineCalculation
              calculateLoading={calculateLoading}
              calculatedDeadlineData={calculatedDeadlineData}
            />
          </div>

        </div>
      </div>
    </div>
  );
}