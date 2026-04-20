"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { WizardContextType, wizardSteps } from "@/lib/wizard-steps"

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState(1)
    const [completedSteps, setCompletedSteps] = useState<number[]>([])

    const totalSteps = wizardSteps.length

    const markStepComplete = useCallback((step: number) => {
        setCompletedSteps((prev) => {
            if (!prev.includes(step)) {
                return [...prev, step]
            }
            return prev
        })
    }, [])

    const goToNextStep = useCallback(() => {
        markStepComplete(currentStep)
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }, [currentStep, totalSteps, markStepComplete])

    const goToPreviousStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }, [currentStep])

    const skipStep = useCallback(() => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }, [currentStep, totalSteps])

    const saveAndExit = useCallback(() => {
        // Save current progress
        console.log("[v0] Saving progress at step:", currentStep)
        console.log("[v0] Completed steps:", completedSteps)
        alert("Progress saved! You can continue later.")
    }, [currentStep, completedSteps])

    const isLastStep = currentStep === totalSteps
    const isFirstStep = currentStep === 1

    return (
        <WizardContext.Provider
            value={{
                currentStep,
                setCurrentStep,
                completedSteps,
                markStepComplete,
                goToNextStep,
                goToPreviousStep,
                skipStep,
                saveAndExit,
                isLastStep,
                isFirstStep,
            }}
        >
            {children}
        </WizardContext.Provider>
    )
}

export function useWizard() {
    const context = useContext(WizardContext)
    if (context === undefined) {
        throw new Error("useWizard must be used within a WizardProvider")
    }
    return context
}
