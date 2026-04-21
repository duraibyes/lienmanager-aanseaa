import { Check, AlertCircle } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { ProjectRole, ProjectType, State } from '../../../types/master';
import { useMemo } from 'react';
import { hasDocuments, hasFurnishingDates, isContactsFilled, isContractFilled, isDescriptionFilled, isDetailsFilled } from '../step-sidebar';
import EditIconButton from '@/components/Button/EditIconButton';

interface SummaryStepProps {
    readonly data: ProjectWizardData;
    readonly onNext?: () => void;
    readonly onBack?: () => void;
    readonly onEdit: (step: number) => void;
    readonly onSaveAndExit?: () => void;
    readonly countries?: State[];
    readonly projectTypes?: ProjectType[];
    readonly roles?: ProjectRole[];
    readonly documentData: File[];
}

export default function SummaryStep({ data, onEdit, documentData }: SummaryStepProps) {

    const totalCount = 9;
    const steps = useMemo(() => [
        {
            id: 2,
            title: "Project Details",
            shortTitle: "Details",
            icon: "file-text",
            description: isDetailsFilled(data) ? "Project Details added" : "Project Details not added",
            entered: isDetailsFilled(data),
        },
        {
            id: 3,
            title: "Important Dates",
            shortTitle: "Dates",
            icon: "calendar",
            description: hasFurnishingDates(data) ? "Project Dates added" : "Project Dates not added",
            entered: hasFurnishingDates(data),
        },
        {
            id: 4,
            title: "Description",
            shortTitle: "Description",
            icon: "align-left",
            description: isDescriptionFilled(data) ? "Project Description  added" : "Project Description  not added",
            entered: isDescriptionFilled(data),
        },
        {
            id: 5,
            title: "Contract Info",
            shortTitle: "Contract",
            icon: "file-signature",
            description: isContractFilled(data) ? "Contract details added" : "Contract details not added",
            entered: isContractFilled(data),
        },
        {
            id: 6,
            title: "Contacts",
            shortTitle: "Contacts",
            icon: "users",
            description: documentData.length ? " Contract details added." : "Contract details not added",
            entered: isContactsFilled(data),
        },
        {
            id: 7,
            title: "Documents",
            shortTitle: "Documents",
            icon: "folder",
            description: documentData.length + " files uploaded",
            entered: hasDocuments(data),
        },
        {
            id: 8,
            title: "Deadlines",
            shortTitle: "Deadlines",
            icon: "clock",
            description: hasFurnishingDates(data) ? "Deadlines set for Project dates" : "Deadlines not set",
            entered: hasFurnishingDates(data),
        },
        {
            id: 9,
            title: "Tasks",
            shortTitle: "Tasks",
            icon: "check-square",
            description: data.tasks?.length > 0 ? data.tasks?.length + " tasks assigned" : data.tasks?.length + " task assigned",
            entered: data.tasks?.length > 0,
        },

    ], [data]);

    const completedCount = steps.filter(x => x.entered).length;
    return (
        <div className="px-2 sm:px-4">
            {/* Progress Overview */}
            <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Completion Status</span>
                    <span className="text-sm font-semibold text-primary">
                        {completedCount}/{totalCount} sections
                    </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex-1 space-y-2 overflow-auto">
                {steps.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                    >
                        <div className="flex items-center gap-3">
                            {item.entered ? (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                    <Check className="h-4 w-4 text-green-600" />
                                </div>
                            ) : (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-foreground">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                        <div>
                            <EditIconButton onClick={() => onEdit(item.id)} />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
