import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Calculator, Calendar, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import { useGetCountriesQuery, useGetProjectRolesQuery, useGetProjectTypesQuery, useGetStatesQuery, useLazyGetCustomerTypesQuery } from '../../features/master/masterDataApi';
import { useGetRemedyDatesQuery } from '../../features/project/projectDataApi';
import { CalculatedDeadline, DeadLineRequestType } from '../../types/deadline';
import { useCalculateDeadlineMutation } from '../../features/project/ProjectDeadlineApi';
import DeadlineCalculation from '../Parts/DeadlineCalculation';
import { PageContainer, PageHeader } from '../layout/page-wrapper';
import { PageSubtitle, PageTitle } from '../ui/typography';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export default function QuickRemediesScreen() {
  const [countryId, setCountryId] = useState(0);
  const [projectState, setProjectState] = useState(0);
  const [role, setRole] = useState(0);
  const [contractType, setContractType] = useState(0);
  const [projectType, setProjectType] = useState(0);
  const [furnishingDates, setFurnishingDates] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const [calculatedDeadlineData, setCalculatedDeadlineData] = useState<CalculatedDeadline[]>([]);

  const shouldFetchRemedyDates =
    projectState &&
    projectType &&
    role &&
    contractType;

  const { data: typesRes, isFetching: isTypeFetching } = useGetProjectTypesQuery();
  const { data: rolesRes, isFetching: isRoleFetching } = useGetProjectRolesQuery();
  const { data: countriesRes } = useGetCountriesQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false
  });
  const { data: states, isFetching: isStatesFetching } = useGetStatesQuery(
    { country_id: Number(countryId) },
    { skip: !countryId }
  );

  const [
    triggerCustomerTypes,
    { data: customerTypesRes, isFetching: isCustomerLoading }
  ] = useLazyGetCustomerTypesQuery();

  const { data: datesRes, isFetching: isDatesFetching } =
    useGetRemedyDatesQuery(
      {
        state_id: projectState,
        project_type_id: projectType,
        role_id: role,
        customer_type_id: contractType,
      },
      {
        skip: !shouldFetchRemedyDates,
        refetchOnMountOrArgChange: true,
      }
    );

  const [
    calculatedDeadline,
    { isLoading: calculateLoading },
  ] = useCalculateDeadlineMutation();

  const doDeadlineCalculation = async () => {
    setLoading(true);
    const payload: DeadLineRequestType = {
      role_id: role,
      state_id: projectState,
      project_type_id: projectType,
      customer_id: contractType,
      furnishing_dates: furnishingDates,
    };
    try {
      const response = await calculatedDeadline(payload).unwrap();

      if (response.data.deadlines) {
        setCalculatedDeadlineData(response?.data?.deadlines ?? []);
      }
      setLoading(false);

    } catch (err) {
      setLoading(false);
      const errorResponse = (err as any)?.data;

      let errorMessage = "Something went wrong";

      if (errorResponse?.errors) {
        const firstErrorKey = Object.keys(errorResponse.errors)[0];
        errorMessage = errorResponse.errors[firstErrorKey][0];
      } else if (errorResponse?.message) {
        errorMessage = errorResponse.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  const handleReset = useCallback(() => {
    setProjectState(0);
    setRole(0);
    setContractType(0);
    setProjectType(0);
    setFurnishingDates({});
    setCalculatedDeadlineData([]);
  }, []);

  const handleFurnishingDate = useCallback((id: number, value: string) => {
    setFurnishingDates((prev) => ({
      ...prev,
      [id]: value,
    }));
    setCalculatedDeadlineData([]);
  }, []);

  useEffect(() => {
    if (countriesRes?.data) {
      let usCountryId = countriesRes?.data?.find(c => c.name === 'United States')?.id || 0;
      setCountryId(usCountryId);
    }
  }, [countriesRes]);

  useEffect(() => {
    if (projectState && projectType && role) {
      triggerCustomerTypes({
        state_id: projectState,
        project_type_id: projectType,
        role_id: role,
      });
    }
  }, [projectState, projectType, role]);

  console.log(' furnishingDates ', furnishingDates)

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <PageTitle> Get Quick Remedies </PageTitle>
            <PageSubtitle className="mt-1">
              View your deadline calculation before creating a project. Fill in the details and click calculate to see important deadlines for your project.
            </PageSubtitle>
          </div>
          <Link to="/project/create">
            <Button className="gradient-primary hover:opacity-90">
              New Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-md">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Project Details</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Country
                  </label>
                  <select
                    value={countryId}
                    onChange={(e) => {
                      setCountryId(Number(e.target.value));
                      setCalculatedDeadlineData([]);
                    }}
                    className="w-full p px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  >
                    {countriesRes?.data?.map((country) => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project State
                  </label>
                  <select
                    value={projectState}
                    onChange={(e) => {
                      setProjectState(Number(e.target.value));
                      setCalculatedDeadlineData([]);
                    }
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  >
                    {/* Loading state */}
                    {isStatesFetching ? (
                      <option value="">Loading states...</option>
                    ) : (
                      <>
                        <option value="">Select State</option>
                        {states?.data?.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(Number(e.target.value));
                      setCalculatedDeadlineData([]);
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  >
                    {/* Loading state */}
                    {isRoleFetching ? (
                      <option value="">Loading Roles...</option>
                    ) : (
                      <>
                        <option value="">Select Role</option>
                        {rolesRes?.data?.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.project_role}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => {
                      setProjectType(Number(e.target.value));
                      setCalculatedDeadlineData([]);
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  >

                    {isTypeFetching ? (
                      <option value="">Loading Project Types...</option>
                    ) : (
                      <>
                        <option value="">Select Type</option>
                        {typesRes?.data?.map((types) => (
                          <option key={types.id} value={types.id}>
                            {types.project_type}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Who is your contract with?
                </label>
                <div className="space-y-3">
                  {customerTypesRes?.status === false && (
                    <p className="text-sm text-red-600 mt-2">{customerTypesRes?.message}</p>
                  )}
                  {contractType === 0 && (
                    <p className="text-sm text-slate-500 mt-2"> Choose State, Role, and Project Type to load contract details </p>
                  )}
                  {isCustomerLoading ? (
                    <p className="text-sm text-slate-500 mt-2">Loading customers...</p>
                  ) : (
                    <div className="space-y-2">

                      {customerTypesRes?.data?.map((option) => (
                        <label key={option.customer.id} className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all">
                          <input
                            type="radio"
                            name="customerType"
                            value={option.customer.id}
                            checked={contractType === option.customer.id}
                            onChange={(e) => setContractType(Number(e.target.value))}
                            className="mt-1 w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-slate-900">{option.customer.name}</div>
                            <div className="text-xs text-slate-600">{option.customer.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {datesRes && shouldFetchRemedyDates && datesRes.data.length > 0 && (
                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Important Dates</h3>
                  </div>

                  <div className="space-y-4">

                    {isDatesFetching ? (
                      <>
                        Fetchin Dates...
                      </>
                    ) :
                      datesRes?.data?.map((date) => (
                        <div key={date.id}>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {date.name} <span className="text-red-600">*</span>
                          </label>

                          <div className="relative">
                            <input
                              type="date"
                              value={furnishingDates[date.id] || ""}
                              onChange={(e) =>
                                handleFurnishingDate(date.id, e.target.value)
                              }
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />

                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                          </div>

                          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Select a date to calculate the deadline.
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}


              <Button
                variant="outline"
                size="sm"
                onClick={doDeadlineCalculation}
                disabled={loading}
                className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 w-full"
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline"> Get Deadlines </span>
              </Button>

              {calculatedDeadlineData.length > 0 && (
                <button
                  onClick={handleReset}
                  className="w-full py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Reset Form
                </button>
              )}
            </div>
          </div>
          <DeadlineCalculation calculateLoading={calculateLoading} calculatedDeadlineData={calculatedDeadlineData} />

        </div>
      </div>
    </PageContainer>
  );
}
