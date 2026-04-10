import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import Swal from "sweetalert2";
import ProjectWizardStepper from "../wizard/projects/ProjectWizardStepper";
import DocumentUploadFirstStep from "../wizard/projects/DocumentUploadFirstStep";
import { initialProjectWizardData, ProjectWizardData } from "../../types/project";
import DetailsStep from "../wizard/projects/DetailsStep";
import DatesStep from "../wizard/projects/DatesStep";
import { useGetCountriesQuery, useGetProjectRolesQuery, useGetProjectTypesQuery } from "../../features/master/masterDataApi";
import { Template } from "../layout/member/Template";
import { useGetProjectInfoQuery, useSubmitProjectMutation } from "../../features/project/projectDataApi";
import { SESSION_WIZARD_KEY } from "../../utils/constant";
import DescriptionStep from "../wizard/projects/DescriptionStep";
import ContractStep from "../wizard/projects/ContractStep";
import ContactsSelectionStep from "../wizard/projects/ContactsSelectionStep";
import DocumentsStep from "../wizard/projects/DocumentsStep";
import DeadlinesStep from "../wizard/projects/DeadlinesStep";
import TasksStep from "../wizard/projects/TasksStep";
import SummaryStep from "../wizard/projects/SummaryStep";
import InfoSheetStep from "../wizard/projects/InfoSheetStep";
import { uploadToAzure } from "../../utils/azureUpload";

const ProjectCreateWizard = () => {
    const { projectId: routeProjectId } = useParams<{ projectId?: string }>();
    const navigate = useNavigate();
    const resolvedProjectId = routeProjectId ? Number(routeProjectId) : undefined;

    const [currentStep, setCurrentStep] = useState(1);
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

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 11));
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
                        onNext={nextStep}
                        onSkip={nextStep}
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
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <DatesStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onNext={nextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                        disabled={saveLoading}
                    />
                );
            case 4:
                return (
                    <DescriptionStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        countries={countries}
                        onNext={nextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                        disabled={saveLoading}
                    />
                );
            case 5:
                return (
                    <ContractStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onNext={nextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                    />
                );
            case 6:
                return (
                    <ContactsSelectionStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onNext={nextStep}
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
                        onNext={nextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                        updateProjectData={updateProjectData}
                    />
                );
            case 8:
                return (
                    <DeadlinesStep
                        data={projectData}
                        onNext={nextStep}
                        onBack={prevStep}
                        onSaveAndExit={saveAndExit}
                    />
                );
            case 9:
                return (
                    <TasksStep
                        data={projectData}
                        onUpdate={updateProjectData}
                        onNext={nextStep}
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
                        onNext={nextStep}
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
        <Template content={
            <>
                <ProjectWizardStepper
                    currentStep={currentStep}
                    onStepClick={goToStep}
                    isEditMode={resolvedProjectId !== undefined}
                />
                <div className="overflow-y-auto">
                    {renderWizardStep()}
                </div>
            </>
        }
            wizardMode={true}
            saveAndExit={saveAndExit}
            saveAndExitDisabled={saveLoading}
        />

    )
}

export default ProjectCreateWizard