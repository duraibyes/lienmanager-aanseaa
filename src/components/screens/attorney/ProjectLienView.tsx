import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectInfoQuery, useGetRemedyDatesQuery } from "../../../features/project/projectDataApi";
import Template from "../../layout/attorney/Template";
import DashboardProjectView from "../../Parts/Lien/DashboardProjectView";
import ContactProjectView from "../../Parts/Lien/ContactProjectView";
import ContractProjectView from "../../Parts/Lien/ContractProjectView";
import ProjectDatesView from "../../Parts/Lien/ProjectDatesView";
import DocumentView from "../../Parts/Lien/DocumentView";
import { useCalculateDeadlineMutation } from "../../../features/project/ProjectDeadlineApi";
import DeadlineView from "../../Parts/Lien/DeadlineView";
import { CalculatedDeadline, DeadLineRequestType } from "../../../types/deadline";
import ProjectTaskView from "../../Parts/Lien/ProjectTaskView";

type TabType = 'Dashboard' | 'Contacts' | 'Contracts' | 'Project Dates' | 'Documents' | 'Deadlines' | 'Tasks';

const ProjectLienView = () => {
    const { projectId } = useParams();
    const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
    const [calculatedDeadlineData, setCalculatedDeadlineData] = useState<CalculatedDeadline[]>([]);

    const [
        calculatedDeadline
    ] = useCalculateDeadlineMutation();

    const { data: project, isFetching } = useGetProjectInfoQuery(
        { projectId: Number(projectId) },
        { skip: !projectId }
    );

    const { data: datesRes } = useGetRemedyDatesQuery({
        state_id: project?.data.stateId ?? 0,
        project_type_id: project?.data.projectTypeId ?? 0,
        role_id: project?.data.roleId ?? 0,
        customer_type_id: project?.data.customerTypeId ?? 0,
    }, {
        refetchOnMountOrArgChange: true,
    });

    const tabs: TabType[] = ['Dashboard', 'Contacts', 'Contracts', 'Project Dates', 'Documents', 'Deadlines', 'Tasks'];

    const doDeadlineCalculation = async () => {
        const payload: DeadLineRequestType = {
            role_id: project?.data.roleId ?? 0,
            state_id: project?.data.stateId ?? 0,
            project_type_id: project?.data.projectTypeId ?? 0,
            customer_id: project?.data.customerTypeId ?? 0,
            furnishing_dates: project?.data.dates ?? [],
        };
        try {
            const response = await calculatedDeadline(payload).unwrap();

            if (response.data.deadlines) {
                setCalculatedDeadlineData(response?.data?.deadlines ?? []);
            }

        } catch (err) {

            const errorResponse = (err as any)?.data;

            let errorMessage = "Something went wrong";

            if (errorResponse?.errors) {
                const firstErrorKey = Object.keys(errorResponse.errors)[0];
                errorMessage = errorResponse.errors[firstErrorKey][0];
            } else if (errorResponse?.message) {
                errorMessage = errorResponse.message;
            }
            console.log(errorMessage);

        }
    };

    useEffect(() => {
        doDeadlineCalculation()
    }, [])


    if (isFetching) {
        return (
            <Template currentPage="projects">
                <div className="p-8">
                    <p className="text-gray-500">Loading project details...</p>
                </div>
            </Template>
        );
    }

    return (
        <Template currentPage="projects">
            <div className="min-h-screen bg-gray-50">
                <div className="border-b border-gray-200 bg-white px-4 sm:px-8 overflow-x-auto">
                    <nav className="flex gap-6 whitespace-nowrap min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-8">
                    {activeTab === 'Dashboard' && (
                        <DashboardProjectView project={project?.data || null} />
                    )}
                    {activeTab === 'Contacts' && <ContactProjectView project={project?.data || null} />}
                    {activeTab === 'Contracts' && <ContractProjectView project={project?.data || null} />}
                    {activeTab === 'Project Dates' && <ProjectDatesView
                        startDate={project?.data?.startDate || 'N/A'}
                        endDate={project?.data?.endDate || 'N/A'}
                        dates={datesRes?.data || []}
                        selectedDate={project?.data?.dates}
                    />}

                    {activeTab === 'Documents' && <DocumentView uploadedDocuments={project?.data?.uploaded_documents || []} />}
                    {activeTab === 'Deadlines' && <DeadlineView deadlines={calculatedDeadlineData ?? []} />}
                    {activeTab === 'Tasks' && <ProjectTaskView tasks={project?.data.tasks || []} />}
                </div>
            </div>
        </Template>
    )
}

export default ProjectLienView