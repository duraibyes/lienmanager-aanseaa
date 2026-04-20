import { useWizard } from "@/contexts/wizard-context"
import { wizardSteps } from "@/lib/wizard-steps"
import { cn } from "@/lib/utils"
import {
    Check,
} from "lucide-react"
import { ProjectWizardData } from "@/types/project"
import { useMemo } from "react"

// const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
//     upload: Upload,
//     "file-text": FileText,
//     calendar: Calendar,
//     "align-left": AlignLeft,
//     "file-signature": FileSignature,
//     users: Users,
//     folder: Folder,
//     clock: Clock,
//     "check-square": CheckSquare,
//     "clipboard-list": ClipboardList,
//     "file-check": FileCheck,
// }

type Props = {
    readonly data: ProjectWizardData;
}

export function StepSidebar({ data }: Props) {
    const { currentStep, setCurrentStep, completedSteps } = useWizard();
    console.log('  data ', data);

    // Split steps into two columns for better use of space
    const leftColumnSteps = wizardSteps // Steps 1-6

    const hasFurnishingDates = (data: ProjectWizardData) =>
        Object.keys(data?.furnishingDates || {}).length > 0;

    const hasDocuments = (data: ProjectWizardData) =>
        data?.documents?.length > 0 ||
        (data?.uploaded_documents?.length ?? 0) > 0;

    const isDetailsFilled = (data: ProjectWizardData) =>
        data.stateId && data.projectTypeId && data.roleId && data.projectName;

    const isContactsFilled = (data: ProjectWizardData) =>
        data.selectedCustomerContacts > 0 &&
        data.selectedProjectContacts?.length > 0;

    const isDescriptionFilled = (data: ProjectWizardData) =>
        data.jobName && data.jobAddress;

    const isInfoSheetFilled = (data: ProjectWizardData) =>
        data.signatureDate && data.customerSignature;

    const steps = useMemo(() => [
        {
            id: 1,
            title: "Upload Documents",
            shortTitle: "Upload",
            icon: "upload",
            description: "Upload contracts, agreements, or project documents",
            entered: false
        },
        {
            id: 2,
            title: "Project Details",
            shortTitle: "Details",
            icon: "file-text",
            description: "Enter basic project information",
            entered: isDetailsFilled(data)
        },
        {
            id: 3,
            title: "Important Dates",
            shortTitle: "Dates",
            icon: "calendar",
            description: "Set key project milestones and deadlines",
            entered: hasFurnishingDates(data)
        },
        {
            id: 4,
            title: "Description",
            shortTitle: "Description",
            icon: "align-left",
            description: "Add detailed project description",
            entered: isDescriptionFilled(data)
        },
        {
            id: 5,
            title: "Contract Info",
            shortTitle: "Contract",
            icon: "file-signature",
            description: "Contract details and terms",
            entered: false
        },
        {
            id: 6,
            title: "Contacts",
            shortTitle: "Contacts",
            icon: "users",
            description: "Add project stakeholders and contacts",
            entered: isContactsFilled(data)
        },
        {
            id: 7,
            title: "Documents",
            shortTitle: "Documents",
            icon: "folder",
            description: "Manage additional project documents",
            entered: hasDocuments(data)
        },
        {
            id: 8,
            title: "Deadlines",
            shortTitle: "Deadlines",
            icon: "clock",
            description: "Set important deadlines and reminders",
            entered: hasFurnishingDates(data)
        },
        {
            id: 9,
            title: "Tasks",
            shortTitle: "Tasks",
            icon: "check-square",
            description: "Create and assign project tasks",
            entered: data.tasks?.length > 0
        },
        {
            id: 10,
            title: "Summary",
            shortTitle: "Summary",
            icon: "clipboard-list",
            description: "Review all entered information",
            entered: true
        },
        {
            id: 11,
            title: "Info Sheet",
            shortTitle: "Info Sheet",
            icon: "file-check",
            description: "Generate final project info sheet",
            entered: isInfoSheetFilled(data)
        },

    ], [data]);

    const renderStep = (step: typeof wizardSteps[0]) => {
        // const Icon = iconMap[step.icon] || FileText
        const isActive = currentStep === step.id
        const isCompleted = completedSteps.includes(step.id)
        // const isPast = step.id < currentStep

        return (
            <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                    "group relative flex items-center gap-2 rounded-lg p-2 transition-all duration-300 focus:outline-none focus:ring-0",
                    "hover:bg-primary/20 hover:text-primary",
                    isActive && "bg-primary/30 focus:ring-bg-primary ring-primary/50 border border-primary",
                    !isActive && !isCompleted && "opacity-60 hover:opacity-100"
                )}
            >
                {/* Step Number/Icon Circle */}
                <div
                    className={cn(
                        "focus:outline-none focus:ring-0",
                        "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ",
                        isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                        isCompleted && !isActive && "bg-primary/80 text-primary-foreground",
                        !isActive && !isCompleted && "bg-sidebar-accent text-sidebar-foreground/70"
                    )}
                >
                    {isCompleted && !isActive ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <span>{step.id}</span>
                    )}

                    {/* Active Pulse */}
                    {isActive && (
                        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
                    )}
                </div>

                {/* Step Title */}
                <div className="flex flex-col items-start overflow-hidden">
                    <span
                        className={cn(
                            "truncate text-xs font-medium transition-colors hover:text-primary",
                            isActive && "text-primary font-semibold",
                            !isActive && "text-sidebar-foreground/80"
                        )}
                    >
                        {step.shortTitle}
                    </span>
                </div>

                {/* Active Indicator Bar */}
                {isActive && (
                    <div className="absolute -left-0.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary" />
                )}
            </button>
        )
    }

    return (
        <aside className="flex h-full w-full flex-col bg-primary/5 text-sidebar-foreground">

            {/* Progress Indicator */}
            <div className="border-b border-sidebar-border p-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-sidebar-foreground/60">Progress</span>
                    <span className="font-semibold text-primary">{Math.round((currentStep / wizardSteps.length) * 100)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-primary/20">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${(currentStep / wizardSteps.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Steps Grid - Two Columns */}
            <div className="flex flex-1 gap-1 overflow-hidden p-3">
                {/* Left Column */}
                <div className="flex flex-1 flex-col gap-1">
                    {leftColumnSteps.map((step) => renderStep(step))}
                </div>

                {/* Divider */}
                {/* <div className="w-px bg-sidebar-border" /> */}

                {/* Right Column */}
                {/* <div className="flex flex-1 flex-col gap-1">
                    {rightColumnSteps.map((step) => renderStep(step))}
                </div> */}
            </div>

            {/* Bottom Info */}
            <div className="border border-sidebar-border p-4">
                <div className="flex items-center justify-between text-xs text-sidebar-foreground/60">
                    <span>Step {currentStep} of {wizardSteps.length}</span>
                    <span>{completedSteps.length} completed</span>
                </div>
            </div>
        </aside>
    )
}
