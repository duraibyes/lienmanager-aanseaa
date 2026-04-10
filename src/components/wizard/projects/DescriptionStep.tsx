import { Info } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { State } from '../../../types/master';
import { useGetCountiesQuery, useGetStatesQuery } from '../../../features/master/masterDataApi';
import WizardFooterButton from '../../Button/WizardFooterButton';
import AddressAutocomplete from '../../Parts/Project/AddressAutoComplete';

interface DescriptionStepProps {
    readonly data: ProjectWizardData;
    readonly countries: State[];
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly onNext: () => void;
    readonly onBack: () => void;
    readonly onSaveAndExit?: () => void;
    readonly disabled: boolean;
}

export default function DescriptionStep({ data, onUpdate, onNext, onBack, onSaveAndExit, countries, disabled }: DescriptionStepProps) {

    const { data: states, isLoading: isStatesLoading, isFetching: isStatesFetching } = useGetStatesQuery(
        { country_id: Number(data.countryId) },
        { skip: !data.countryId }
    );

    const { data: counties, isLoading: isCountiesLoading, isFetching: isCountiesFetching } = useGetCountiesQuery(
        { state_id: Number(data.stateId) },
        { skip: !data.stateId }
    );

    const handleCountyChange = (county: string) => {
        onUpdate({ jobCountyId: Number(county) });
    }

    const isValid = data.jobAddress && data.jobName && data.jobCountyId && data.jobCity && data.jobZip;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 md:py-12">
            <div className="mb-8">
                <h1 className="md:text-3xl text-ml font-bold text-slate-900 mb-3">Job Description</h1>
                <p className="text-sm md:text-lg text-slate-600">
                    Provide detailed information about the job site and project location.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Job Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.jobName}
                        onChange={(e) => onUpdate({ jobName: e.target.value })}
                        placeholder="Enter Job Name"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Official name or description of the construction job
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Job Address <span className="text-red-600">*</span>
                    </label>
                    <AddressAutocomplete data={data} onUpdate={onUpdate}
                        states={states?.data || []}
                        counties={counties?.data || []}
                    />
                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Physical location where work is being performed
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Job Country <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={data.countryId}
                            disabled
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                                <option key={country.id} value={country.id}>{country.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Defaults to United States
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Job State <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={data.stateId}
                            disabled
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
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
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Job County <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={data.jobCountyId}
                            onChange={(e) => handleCountyChange(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {isCountiesLoading || isCountiesFetching ? (
                                <option value="">Loading Counties...</option>
                            ) : (
                                <>
                                    <option value="">Select County</option>
                                    {counties?.data?.map((county) => (
                                        <option key={county.id} value={county.id}>
                                            {county.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Job City <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.jobCity}
                            onChange={(e) => onUpdate({ jobCity: e.target.value })}
                            placeholder="City"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            ZIP Code <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.jobZip == '0' ? '' : data.jobZip}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                onUpdate({ jobZip: value });
                            }}
                            placeholder="ZIP"
                            maxLength={6}
                            inputMode="numeric"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Why is this information important?</h3>
                    <p className="text-sm text-blue-800">
                        The job site address is crucial for mechanics lien filings. It must match the legal description
                        of the property and will appear on all official notices and lien documents.
                    </p>
                </div>
            </div>

            <WizardFooterButton
                onBack={onBack}
                onSaveAndExit={onSaveAndExit}
                disabled={disabled}
                continueDisabled={!isValid}
                onNext={onNext}
            />
        </div>
    );
}
