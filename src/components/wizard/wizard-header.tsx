import { useWizard } from "@/contexts/wizard-context"
import { wizardSteps } from "@/lib/wizard-steps"
import { Button } from "@/components/ui/button"
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { ProjectWizardData } from "@/types/project"
import { hasDocuments, hasFurnishingDates, isContactsFilled, isDescriptionFilled, isDetailsFilled, isInfoSheetFilled } from "./step-sidebar"
import { useMemo } from "react"

type Props = {
    saveAndExit: () => void;
    readonly data: ProjectWizardData;
}

export function WizardHeader({ saveAndExit, data }: Props) {
    const { currentStep, goToNextStep, goToPreviousStep, skipStep, isLastStep, isFirstStep } = useWizard()
    const currentStepData = wizardSteps.find((s) => s.id === currentStep)

    const steps = useMemo(() => [
        {
            id: 1,
            title: "Upload Documents",
            shortTitle: "Upload",
            icon: "upload",
            description: "Upload contracts, agreements, or project documents",
            entered: false,
            isClickable: true
        },
        {
            id: 2,
            title: "Project Details",
            shortTitle: "Details",
            icon: "file-text",
            description: "Enter basic project information",
            entered: isDetailsFilled(data),
            isClickable: isDetailsFilled(data)
        },
        {
            id: 3,
            title: "Important Dates",
            shortTitle: "Dates",
            icon: "calendar",
            description: "Set key project milestones and deadlines",
            entered: hasFurnishingDates(data),
            isClickable: isDetailsFilled(data)
        },
        {
            id: 4,
            title: "Description",
            shortTitle: "Description",
            icon: "align-left",
            description: "Add detailed project description",
            entered: isDescriptionFilled(data),
            isClickable: isDetailsFilled(data)
        },
        {
            id: 5,
            title: "Contract Info",
            shortTitle: "Contract",
            icon: "file-signature",
            description: "Contract details and terms",
            entered: false,
            isClickable: isDetailsFilled(data)
        },
        {
            id: 6,
            title: "Contacts",
            shortTitle: "Contacts",
            icon: "users",
            description: "Add project stakeholders and contacts",
            entered: isContactsFilled(data),
            isClickable: isDetailsFilled(data)
        },
        {
            id: 7,
            title: "Documents",
            shortTitle: "Documents",
            icon: "folder",
            description: "Manage additional project documents",
            entered: hasDocuments(data),
            isClickable: isDetailsFilled(data)
        },
        {
            id: 8,
            title: "Deadlines",
            shortTitle: "Deadlines",
            icon: "clock",
            description: "Set important deadlines and reminders",
            entered: hasFurnishingDates(data),
            isClickable: isDetailsFilled(data)
        },
        {
            id: 9,
            title: "Tasks",
            shortTitle: "Tasks",
            icon: "check-square",
            description: "Create and assign project tasks",
            entered: data.tasks?.length > 0,
            isClickable: isDetailsFilled(data)
        },
        {
            id: 10,
            title: "Summary",
            shortTitle: "Summary",
            icon: "clipboard-list",
            description: "Review all entered information",
            entered: isDetailsFilled(data),
            isClickable: isDetailsFilled(data)
        },
        {
            id: 11,
            title: "Info Sheet",
            shortTitle: "Info Sheet",
            icon: "file-check",
            description: "Generate final project info sheet",
            entered: isInfoSheetFilled(data),
            isClickable: isDetailsFilled(data)
        },

    ], [data]);

    const disableNext = steps.find(x => x.id === currentStep);

    console.log('  disableNext?.isClickable ', disableNext?.isClickable)

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
            {/* Left: Navigation */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPreviousStep}
                    disabled={isFirstStep}
                    className="gap-1.5"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back</span>
                </Button>
            </div>

            {/* Center: Step Title */}
            <div className="flex flex-col items-center">
                <h1 className="text-sm font-semibold text-foreground sm:text-base">{currentStepData?.title}</h1>
                <p className="hidden text-xs text-muted-foreground sm:block">{currentStepData?.description}</p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={saveAndExit}
                    className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Save & Exit</span>
                </Button>

                {!isLastStep ? (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={skipStep}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Skip
                        </Button>
                        <Button
                            size="sm"
                            disabled={!disableNext?.isClickable}
                            onClick={goToNextStep}
                            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </>
                ) : (
                    <Button
                        size="sm"
                        onClick={goToNextStep}
                        className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                        <span>Complete</span>
                    </Button>
                )}
            </div>
        </header>
    )
}
