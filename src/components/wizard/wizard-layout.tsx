
// import { StepContent } from "./step-content"
import { wizardSteps } from "@/lib/wizard-steps"
import { StepSidebar } from "./step-sidebar"
import { WizardHeader } from "./wizard-header"
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useState } from "react";
import { initialProjectWizardData, ProjectWizardData } from "@/types/project";
import { useGetProjectInfoQuery, useSubmitProjectMutation } from "@/features/project/projectDataApi";
import { useGetCountriesQuery, useGetProjectRolesQuery, useGetProjectTypesQuery } from "@/features/master/masterDataApi";
import { SESSION_WIZARD_KEY } from "@/utils/constant";
import { uploadToAzure } from "@/utils/azureUpload";
import Swal from "sweetalert2";
import DocumentUploadFirstStep from "./projects/DocumentUploadFirstStep";
import DetailsStep from "./projects/DetailsStep";
import DatesStep from "./projects/DatesStep";
import DescriptionStep from "./projects/DescriptionStep";
import ContractStep from "./projects/ContractStep";
import ContactsSelectionStep from "./projects/ContactsSelectionStep";
import DeadlinesStep from "./projects/DeadlinesStep";
import DocumentsStep from "./projects/DocumentsStep";
import TasksStep from "./projects/TasksStep";
import SummaryStep from "./projects/SummaryStep";
import InfoSheetStep from "./projects/InfoSheetStep";
import { useWizard } from "@/contexts/wizard-context";

export function WizardLayout() {
    const { currentStep, setCurrentStep, completedSteps, goToNextStep } = useWizard();
    const { projectId: routeProjectId } = useParams<{ projectId?: string }>();
    const navigate = useNavigate();
    const resolvedProjectId = routeProjectId ? Number(routeProjectId) : undefined;
    console.log('  currentStep ', currentStep, ' completedSteps ', completedSteps);

    const [projectData, setProjectData] = useState<ProjectWizardData>(initialProjectWizardData);
    const [documentData, setDocumentData] = useState<File[]>([]);

    const [
        submitProject,
        { isLoading: saveLoading },
    ] = useSubmitProjectMutation();

    const { data: typesRes } = useGetProjectTypesQuery();
    const { data: rolesRes } = useGetProjectRolesQuery();
    const { data: countriesRes } = useGetCountriesQuery();
    const { data } = useGetProjectInfoQuery(
        resolvedProjectId ? { projectId: resolvedProjectId } : skipToken,
        {
            skip: !resolvedProjectId,
        }
    );

    const isEditMode = Boolean(resolvedProjectId);

    const countries = countriesRes?.data ?? [];
    const projectTypes = typesRes?.data ?? [];
    const roles = rolesRes?.data ?? [];

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
    const goToStep = (step: number) => setCurrentStep(step);

    const updateProjectData = useCallback((data: Partial<ProjectWizardData>) => {
        setProjectData((prev) => {
            const updatedData = { ...prev, ...data };
            if (!isEditMode) {
                sessionStorage.setItem(
                    SESSION_WIZARD_KEY,
                    JSON.stringify({
                        data: updatedData,
                        step: currentStep,
                    })
                );
            }
            return updatedData;
        });
    }, []);

    const saveAndExit = async () => {
        try {

            let uploadedDocs: { url: string; name: string }[] = [];

            if (documentData.length > 0) {
                for (const file of documentData) {
                    const url = await uploadToAzure(file);

                    uploadedDocs.push({
                        url,
                        name: file.name,
                    });
                }
            }

            const payload = {
                ...projectData,
                documents: uploadedDocs,
            };

            const res = await submitProject(payload)
            console.log('  res ', res);

            if ("data" in res && res.data?.status) {
                sessionStorage.removeItem(SESSION_WIZARD_KEY);

                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    timer: 3000,
                    text: "Project saved successfully",
                });

                navigate("/dashboard");
            } else {
                const errorData = (res as any).error?.data;

                let errorMessage = "Something went wrong";

                if (errorData?.errors) {
                    const firstKey = Object.keys(errorData.errors)[0];
                    errorMessage = errorData.errors[firstKey][0];
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                }

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMessage,
                });
            }

        } catch (err: any) {
            const errorResponse = err?.data;

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

    useEffect(() => {
        if (countries && countries.length > 0 && !projectData.countryId) {
            let usCountryId = countries.find(c => c.name === 'United States')?.id || 0;
            setProjectData((prev) => ({ ...prev, countryId: usCountryId }));
        }
    }, [countries]);

    useEffect(() => {
        const saved = sessionStorage.getItem(SESSION_WIZARD_KEY);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setProjectData(parsed.data ?? initialProjectWizardData);
                setCurrentStep(parsed.step ?? 1);
            } catch (e) {
                console.error("Invalid session wizard data", e);
                sessionStorage.removeItem(SESSION_WIZARD_KEY);
            }
        }

    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };

        const handlePopState = () => {
            const confirmLeave = window.confirm(
                "If you leave this page, your progress will be lost. Continue?"
            );

            if (!confirmLeave) {
                window.history.pushState(null, "", window.location.href);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);


    useEffect(() => {
        if (isEditMode && data?.data) {
            const project = data.data;

            setProjectData({
                ...initialProjectWizardData,
                projectId: project.id,
                projectName: String(project.projectName ?? ""),
                countryId: project.countryId ?? "",
                country: project.country ?? "",
                state: project.state ?? "",
                stateId: project.stateId ?? "",
                projectTypeId: project.projectTypeId ?? 0,
                roleId: project.roleId ?? 0,
                customerTypeId: project.customerTypeId ?? 0,

                startDate: String(project.startDate ?? ""),
                endDate: String(project.endDate ?? ""),
                jobName: project.jobName ?? '',
                jobAddress: project.jobAddress ?? '',
                jobCity: project.jobCity ?? '',
                jobStateId: project.stateId ?? 0,
                jobZip: String(project.jobZip ?? 0),
                jobCountryId: project.countryId ?? 0,
                jobCountyId: project.jobCountyId ?? 0,

                furnishingDates: project.dates ?? [],

                baseContractAmount: String(project.contracts?.baseContractAmount ?? ""),
                additionalCosts: String(project.contracts?.additionalCosts ?? ""),
                paymentsCredits: String(project.contracts?.paymentsCredits ?? ""),
                jobProjectNumber: String(project.contracts?.jobProjectNumber ?? ''),
                materialServicesDescription: String(project.contracts?.materialServicesDescription ?? ''),

                selectedCustomerContacts: project.selectedCustomerContacts ?? 0,
                selectedProjectContacts: project.selectedProjectContacts ?? [],
                uploaded_documents: project.uploaded_documents ?? [],

                signatureDate: String(project.signatureDate ?? ""),
                customerSignature: String(project.signature ?? ""),
                // map all fields properly
            });
        }
    }, [isEditMode, data]);

    const renderWizardStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <DocumentUploadFirstStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onNext={goToNextStep}
                    />
                );
            case 2:
                return (
                    <DetailsStep
                        data={projectData}
                        countries={countries}
                        projectTypes={projectTypes}
                        roles={roles}
                        onUpdate={updateProjectData}
                        onNext={goToNextStep}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <DatesStep
                        data={projectData}
                        onUpdate={updateProjectData}

                    />
                );
            case 4:
                return (
                    <DescriptionStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        countries={countries}
                    />
                );
            case 5:
                return (
                    <ContractStep
                        data={projectData}
                        onUpdate={updateProjectData}
                    />
                );
            case 6:
                return (
                    <ContactsSelectionStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onNext={goToNextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                    />
                );
            case 7:
                return (
                    <DocumentsStep
                        data={documentData}
                        uploadedDocuments={projectData.uploaded_documents || []}
                        onUpdate={setDocumentData}
                        onNext={goToNextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                        updateProjectData={updateProjectData}
                    />
                );
            case 8:
                return (
                    <DeadlinesStep
                        data={projectData}
                        onNext={goToNextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                    />
                );
            case 9:
                return (
                    <TasksStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onNext={goToNextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                    />
                );

            case 10:
                return (
                    <SummaryStep
                        data={projectData}
                        countries={countries}
                        projectTypes={projectTypes}
                        roles={roles}
                        onNext={goToNextStep}
                        onBack={prevStep}
                        onEdit={goToStep}
                        onSaveAndExit={saveAndExit}
                        documentData={documentData}
                    />
                );
            case 11:
                return (
                    <InfoSheetStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onBack={prevStep}
                        onComplete={saveAndExit}
                        countries={countries}
                        projectTypes={projectTypes}
                        saveLoading={saveLoading}
                    />
                );

            default:
                return null;
        }
    };
    return (
        <div className="flex  overflow-hidden bg-background">
            {/* Left Sidebar - Step Navigation */}
            <div className="hidden h-full w-64 shrink-0 border-r border-sidebar-border lg:block xl:w-72">
                <StepSidebar data={projectData} />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header with actions */}
                <WizardHeader saveAndExit={saveAndExit} />

                {/* Step Content */}
                <main className="bg-primary/2.5">
                    <div className="h-full p-2 px-4">
                        {renderWizardStep()}
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                <MobileStepNav />
            </div>
        </div>
    )
}

// Mobile bottom navigation for smaller screens
function MobileStepNav() {
    return (
        <div className="flex h-16 shrink-0 items-center justify-center border-t border-border bg-card px-4 lg:hidden">
            <MobileStepIndicator />
        </div>
    )
}

// Compact step indicator for mobile
function MobileStepIndicator() {
    const { currentStep, setCurrentStep, completedSteps } = useWizard()

    return (
        <div className="flex w-full flex-col items-center gap-2">
            <div className="flex items-center gap-1">
                {wizardSteps.map((step) => {
                    const isActive = currentStep === step.id
                    const isCompleted = completedSteps.includes(step.id)
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className={`h-2 w-2 rounded-full transition-all ${isActive
                                ? "w-6 bg-primary"
                                : isCompleted
                                    ? "bg-primary/60"
                                    : "bg-muted"
                                }`}
                        />
                    )
                })}
            </div>
            <span className="text-xs text-muted-foreground">
                Step {currentStep} of {wizardSteps.length}
            </span>
        </div>
    )
}
