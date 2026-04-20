import { useWizard } from "@/contexts/wizard-context"
import { wizardSteps } from "@/lib/wizard-steps"
import { Button } from "@/components/ui/button"
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react"

export function WizardHeader({ saveAndExit }: { saveAndExit: () => void }) {
    const { currentStep, goToNextStep, goToPreviousStep, skipStep, isLastStep, isFirstStep } = useWizard()
    const currentStepData = wizardSteps.find((s) => s.id === currentStep)

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
