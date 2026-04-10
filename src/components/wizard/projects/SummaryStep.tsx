import { Edit, CheckCircle, FileText, Calendar, MapPin, DollarSign, Users, File } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { ProjectRole, ProjectType, State } from '../../../types/master';
import { useGetCustomerTypesQuery, useGetStatesQuery } from '../../../features/master/masterDataApi';
import ProjectDetails from '../../Parts/Summary/ProjectDetails';
import { useGetRemedyDatesQuery } from '../../../features/project/projectDataApi';
import WizardFooterButton from '../../Button/WizardFooterButton';

interface SummaryStepProps {
    readonly data: ProjectWizardData;
    readonly onNext: () => void;
    readonly onBack: () => void;
    readonly onEdit: (step: number) => void;
    readonly onSaveAndExit?: () => void;
    readonly countries: State[];
    readonly projectTypes: ProjectType[];
    readonly roles: ProjectRole[];
    readonly documentData: File[];
}

export default function SummaryStep({ data, onNext, onBack, onEdit, onSaveAndExit, countries, projectTypes, roles, documentData }: SummaryStepProps) {
    const { data: states } = useGetStatesQuery(
        { country_id: Number(data.countryId) },
        { skip: !data.countryId }
    );

    const { data: customerTypes } =
        useGetCustomerTypesQuery(
            {
                state_id: data.stateId,
                project_type_id: data.projectTypeId,
                role_id: data.roleId,
            },
            {
                skip:
                    !data.stateId ||
                    !data.projectTypeId ||
                    !data.roleId,
            }
        );

    const { data: datesRes } = useGetRemedyDatesQuery({
        state_id: data.stateId,
        project_type_id: data.projectTypeId,
        role_id: data.roleId,
        customer_type_id: data.customerTypeId,
    }, {
        refetchOnMountOrArgChange: true,
    });

    const state = states?.data.find(x => x.id === data.stateId);
    const country = countries?.find(x => x.id === data.countryId);
    const projectType = projectTypes?.find(x => x.id === data.projectTypeId);
    const role = roles?.find(x => x.id === data.roleId);
    const customerType = customerTypes?.data?.find(x => x.id === data.customerTypeId);

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-xl md:text-3xl font-bold text-slate-900 mb-3">Project Summary</h1>
                <p className="text-sm md:text-lg text-slate-600">
                    Review all the information you've entered. Click any section to edit.
                </p>
            </div>

            <div className="md:space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-900">Project Details</h3>
                        </div>
                        <button
                            onClick={() => onEdit(2)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <ProjectDetails name={data.projectName}
                        country={country?.name || ''}
                        state={state?.name || ''}
                        role={role?.project_role || ''}
                        projectType={projectType?.project_type || ''}
                        customerType={customerType?.customer?.name || 'N/A'}
                    />
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-bold text-slate-900">Dates</h3>
                        </div>
                        <button
                            onClick={() => onEdit(3)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-4">
                        {data.startDate && (
                            <div>
                                <div className="text-sm text-slate-600">Start Date</div>
                                <div className="font-semibold text-slate-900">{new Date(data.startDate).toLocaleDateString()}</div>
                            </div>
                        )}
                        {data.endDate && (
                            <div>
                                <div className="text-sm text-slate-600">End Date</div>
                                <div className="font-semibold text-slate-900">{new Date(data.endDate).toLocaleDateString()}</div>
                            </div>
                        )}
                        {datesRes?.data.map((date) => (
                            <div key={date.id}>
                                <div className="text-sm text-slate-600">{date.name}</div>
                                <div className="font-semibold text-slate-900">{data.furnishingDates?.[date.id] || "N/A"}</div>
                            </div>
                        ))
                        }
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-slate-900">Job Description</h3>
                        </div>
                        <button
                            onClick={() => onEdit(4)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="text-sm text-slate-600">Job Name</div>
                            <div className="font-semibold text-slate-900">{data.jobName}</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-600">Job Address</div>
                            <div className="font-semibold text-slate-900">
                                {data.jobAddress}<br />
                                {data.jobCity}, {state?.name} {data.jobZip}<br />
                                {country?.name}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-slate-900">Contract Information</h3>
                        </div>
                        <button
                            onClick={() => onEdit(5)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="text-sm text-slate-600">Contract Amount</div>
                        <div className="text-2xl font-bold text-slate-900">${data.revisedCost}</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-teal-600" />
                            </div>
                            <h3 className="font-bold text-slate-900">Contacts</h3>
                        </div>
                        <button
                            onClick={() => onEdit(6)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="text-sm text-slate-600">{Number(data.selectedProjectContacts.length) + Number(data.selectedCustomerContacts > 0 ? 1 : 0)} contact(s) selected</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                <File className="w-5 h-5 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-slate-900">Documents</h3>
                        </div>
                        <button
                            onClick={() => onEdit(7)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="text-sm text-slate-600">{documentData.length} document(s) uploaded</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <h3 className="font-bold text-slate-900">Tasks</h3>
                        </div>
                        <button
                            onClick={() => onEdit(9)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="text-sm text-slate-600">{data.tasks.length} task(s) created</div>
                    </div>
                </div>
            </div>

            <WizardFooterButton
                onBack={onBack}
                onSaveAndExit={onSaveAndExit}
                onNext={onNext}
            />
        </div>
    );
}
