import { useCallback, useEffect, useRef } from 'react';
import { Info, Globe } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { ProjectRole, ProjectType, State } from '../../../types/master';
import { useGetStatesQuery, useLazyGetCustomerTypesQuery } from '../../../features/master/masterDataApi';
import ContinueBtn from '../../Button/ContinueBtn';
import BackBtn from '../../Button/BackBtn';

interface DetailsStepProps {
  readonly data: ProjectWizardData;
  readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
  readonly countries: State[];
  readonly projectTypes: ProjectType[];
  readonly roles: ProjectRole[];
}


export default function DetailsStep({ data, onUpdate, onNext, onBack, countries, projectTypes, roles }: DetailsStepProps) {

  const { data: states, isLoading: isStatesLoading, isFetching: isStatesFetching } = useGetStatesQuery(
    { country_id: Number(data.countryId) },
    { skip: !data.countryId }
  );

  const prevRef = useRef({
    stateId: data.stateId,
    projectTypeId: data.projectTypeId,
    roleId: data.roleId,
  });

  const [
    fetchCustomerTypes,
    { data: customerTypesRes, isFetching: isCustomerLoading },
  ] = useLazyGetCustomerTypesQuery();


  const handleCountryChange = useCallback((country: string) => {
    const countryName = countries.find(x => x.id == Number(country));
    onUpdate({ countryId: Number(country), stateId: 0, country: countryName?.name ?? '' });
  }, []);

  const isValid = data.projectName && data.countryId && data.stateId && data.projectTypeId && data.roleId && data.customerTypeId;
  const canSelectRole = Boolean(data.stateId && data.projectTypeId);

  useEffect(() => {

    if (
      data.stateId &&
      data.projectTypeId &&
      data.roleId
    ) {

      const changed =
        prevRef.current.stateId !== data.stateId ||
        prevRef.current.projectTypeId !== data.projectTypeId ||
        prevRef.current.roleId !== data.roleId;

      const stateName = states?.data?.find(x => x.id === data.stateId);

      if (changed) {
        onUpdate({
          customerTypeId: undefined,
          state: stateName?.name ?? ''
        });
      }

      fetchCustomerTypes({
        state_id: data.stateId,
        project_type_id: data.projectTypeId,
        role_id: data.roleId,
      });

      prevRef.current = {
        stateId: data.stateId,
        projectTypeId: data.projectTypeId,
        roleId: data.roleId,
      };

    }

  }, [
    data.stateId,
    data.projectTypeId,
    data.roleId,
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-slate-900 mb-3">Project Details</h1>
        <p className="text-base text-sm md:text-lg text-slate-600">
          Let's start by gathering the basic information about your project.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-8 space-y-6">
        <div>
          <label className="block md:text-sm font-semibold text-slate-700 mb-2">
            Project Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={data.projectName}
            onChange={(e) => onUpdate({ projectName: e.target.value })}
            placeholder="Enter project name"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            A clear, descriptive name for this project
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Country <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <select
              value={data.countryId}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countries.map((country) => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Construction and lien laws vary by country
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Project Location (State/Region) <span className="text-red-600">*</span>
          </label>
          <select
            value={data.stateId}
            onChange={(e) => onUpdate({ stateId: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!data.countryId}
          >
            {/* Loading state */}
            {isStatesLoading || isStatesFetching ? (
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
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Lien laws and deadlines vary significantly by {data.countryId === 1 ? 'region' : 'state'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Project Type <span className="text-red-600">*</span>
          </label>
          <div className="space-y-2">
            {projectTypes.map((option) => (
              <label key={option.id} className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all">
                <input
                  type="radio"
                  name="projectType"
                  value={option.id}
                  checked={data.projectTypeId === option.id}
                  onChange={(e) => {
                    onUpdate({ projectTypeId: Number(e.target.value) });

                  }}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">{option.project_type}</div>
                  <div className="text-xs text-slate-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Your Role <span className="text-red-600">*</span>
          </label>
          {!canSelectRole && (
            <p className="text-red-600 text-sm mt-2">
              Select State and Project Type first
            </p>
          )}
          <div className="space-y-2">
            {roles.map((option) => (
              <label key={option.id} className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-all">
                <input
                  type="radio"
                  name="role"
                  disabled={!canSelectRole}
                  value={option.id}
                  checked={data.roleId === option.id}
                  onChange={(e) => {
                    onUpdate({ roleId: Number(e.target.value) });
                  }}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">{option.project_role}</div>
                  <div className="text-xs text-slate-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        {Boolean(data?.roleId) && (

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Your Customer <span className="text-red-600">*</span>
            </label>
            {customerTypesRes?.status === false && (
              <p className="text-sm text-red-600 mt-2">{customerTypesRes?.message}</p>
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
                      checked={data.customerTypeId === option.customer.id}
                      onChange={(e) => onUpdate({ customerTypeId: Number(e.target.value) })}
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
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
        <BackBtn onBack={onBack} />
        <ContinueBtn onNext={onNext} disabled={!isValid} />
      </div>
    </div>
  );
}
