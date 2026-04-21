import { CheckCircle, Calendar, FileSignature, AlertCircle } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { useGetStatesQuery } from '../../../features/master/masterDataApi';
import { ProjectType, State } from '../../../types/master';
import { isInfoSheetFilled } from '../step-sidebar';

interface InfoSheetStepProps {
    readonly data: ProjectWizardData;
    readonly onUpdate: (data: Partial<ProjectWizardData>) => void;
    readonly onBack?: () => void;
    readonly onComplete: () => void;
    readonly countries: State[];
    readonly projectTypes: ProjectType[];
    readonly saveLoading: boolean;
}

export default function InfoSheetStep({ data, onUpdate, onComplete, countries, projectTypes, saveLoading }: InfoSheetStepProps) {

    const { data: states } = useGetStatesQuery(
        { country_id: Number(data.countryId) },
        { skip: !data.countryId }
    );

    const country = countries.find(x => x.id === data.countryId);
    const state = states?.data?.find(x => x.id === data.stateId);
    const projectType = projectTypes?.find(x => x.id === data.projectTypeId);
    const disabled = isInfoSheetFilled(data);

    return (
        <div className="">
            <div className="w-full space-y-4">

                <div className="bg-primary/5 rounded-2xl shadow-lg border border-slate-200 p-4">

                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-primary" />
                            Project Summary
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {[
                            { label: "Project Name", value: data.projectName },
                            { label: "Location", value: `${state?.name}, ${country?.name}` },
                            { label: "Type", value: projectType?.project_type },
                            { label: "Contract Amount", value: `$${data.revisedCost}` },
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 border border-primary/40  shadow-sm">
                                <p className="text-xs text-slate-500">{item.label}</p>
                                <p className="text-sm font-semibold text-slate-800 mt-1">{item.value}</p>
                            </div>
                        ))}

                        <div className=" bg-white rounded-xl p-4 border border-primary/40 shadow-sm">
                            <p className="text-xs text-slate-500">Job Address</p>
                            <p className="text-sm font-semibold text-slate-800 mt-1">
                                {data.jobAddress}, {data.jobCity}, {state?.name} {data.jobZip}
                            </p>
                        </div>

                    </div>
                </div>

                <div className="bg-primary/4 rounded-2xl shadow-lg border border-slate-200 p-4 space-y-4">

                    <h3 className="text-lg font-semibold text-slate-800">
                        Confirmation Details
                    </h3>
                    <div className='flex gap-4 flex-col sm:flex-row '>

                        <div className="space-y-2 max-w-sm">
                            <label className="text-sm font-medium text-slate-600">
                                Customer Signature
                            </label>

                            <input
                                type="text"
                                value={data.customerSignature}
                                onChange={(e) => onUpdate({ customerSignature: e.target.value })}
                                placeholder="Type your full name"
                                className="w-full px-4 py-1.5 rounded-xl border border-slate-300 focus:ring-4 focus:outline-none focus:ring-primary/40 focus:border-primary text-lg font-serif italic shadow-sm"
                            />

                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <FileSignature className="w-3 h-3" />
                                Electronic signature confirmation
                            </p>
                        </div>

                        <div className="space-y-2 max-w-md">
                            <label className="text-sm font-medium text-slate-600">
                                Signature Date
                            </label>

                            <div className="relative">
                                <input
                                    type="date"
                                    value={data.signatureDate}
                                    onChange={(e) => onUpdate({ signatureDate: e.target.value })}
                                    className="w-full px-4 py-1.5 rounded-xl border border-slate-300 focus:ring-4 focus:outline-none focus:ring-primary/40 focus:border-primary shadow-sm"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-amber-900 mb-1">
                        Legal Disclaimer
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed">
                        This information is for record purposes only. Please verify details and consult a licensed attorney for legal matters.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        onClick={onComplete}
                        disabled={!disabled || saveLoading}
                        className={`w-full sm:w-auto px-8 py-3 rounded-xl bg-primary  text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:bg-slate-300 disabled:scale-100 flex items-center justify-center gap-2`}
                    >
                        {saveLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                {data?.projectId ? 'Update Project' : 'Create Project'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
