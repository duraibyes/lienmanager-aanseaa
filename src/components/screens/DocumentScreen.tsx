import { Plus, Search } from "lucide-react"
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useGetAllProjectsQuery, useGetProjectDocumentQuery } from "../../features/document/DocumentApi";
import AddDocumentModal from "../Parts/Document/AddDocumentModal";
import IconButton from "../Button/IconButton";
import DocumentListCard from "../Parts/Document/DocumentListCard";

const DocumentScreen = () => {
    const location = useLocation();
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(location.state?.project_id || 0);
    const [selectedProject, setSelectedProject] = useState<number>(location.state?.project_id || selectedId);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { data, isLoading } = useGetProjectDocumentQuery();

    const { data: projects } = useGetAllProjectsQuery();

    const projectOptions = useMemo(() => {
        if (!projects?.data) return [];

        if (selectedId === 0) {
            setSelectedId(projects?.data[0].id);
            setSelectedProject(projects?.data[0].id)
        }

        return projects?.data?.map((project) => ({
            id: project.id,
            name: project.project_name,
        }));

    }, [projects]);

    const filteredDocuments = useMemo(() => {

        if (!data?.data) return null;

        return data.data
            .find((project) => {

                const matchesProject = project.project_id === selectedId;

                const matchesSearch =
                    project.project_name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    project.documents.some((doc) =>
                        doc.title
                            .toLowerCase()
                            .includes(search.toLowerCase())
                    );

                return matchesProject && matchesSearch;

            });

    }, [data, selectedId, search]);

    const handleModalClose = () => {
        setShowModal(false);
    }

    console.log('  filteredDocuments ', filteredDocuments);
    console.log(' selectedProject ', selectedProject)
    console.log(' selectedId ', selectedId)

    return (
        <div className="px-2 sm:px-6">
            <div className="mb-6 sm:mb-8 px-3 sm:px-0">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    {/* Title Section */}
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                            Documents
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600">
                            Keep all your project files in one centralized place
                        </p>
                    </div>

                    <IconButton label="Add Document" icon={Plus} variant="primary" onClick={() => setShowAddModal(true)} />

                </div>

                <div className="flex flex-col lg:flex-row gap-4">

                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />

                        <input
                            type="text"
                            placeholder="Search documents, projects, or customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="
                                w-full
                                pl-9 sm:pl-10 pr-4 
                                py-2.5 sm:py-3
                                text-sm sm:text-base
                                border-2 border-slate-300 
                                rounded-lg 
                                focus:ring-2 focus:ring-blue-500 
                                focus:border-transparent
                                "
                        />
                    </div>




                </div>

            </div>
            <div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-4">
                        <div>
                            <ul className="rounded-md shadow-md p-2 border border-gray-300">
                                {projectOptions.map((project) => (
                                    <li key={project.id} onClick={() => setSelectedId(project.id)} className={`p-4  ${selectedId === project.id ? "border rounded-md border-primary text-primary" : "bg-white text-blue-950"} font-semibold  cursor-pointer hover:bg-primary/40 hover:text-white`}>
                                        {project.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            {filteredDocuments && (

                                <div className="bg-gray-100 p-4 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-lg text-slate-900 mb-1 sm:mb-2">{filteredDocuments.project_name}</p>

                                        <IconButton onClick={() => {
                                            setShowModal(true)
                                        }}
                                            variant="primary"
                                            icon={Plus}
                                            size="sm"
                                        />
                                    </div>
                                    <div className="bg-slate-50 my-4">
                                        {filteredDocuments.documents.map(document => (
                                            <DocumentListCard document={document} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* <DocumentCard filteredDocuments={filteredDocuments} /> */}
                    </div>
                )
                }
            </div >

            {
                showAddModal && (
                    <AddDocumentModal
                        show={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        projects={projectOptions}
                    />
                )
            }
            {showModal &&
                <AddDocumentModal show={showModal} projectId={selectedId} onClose={handleModalClose} />}


        </div >
    )
}

export default DocumentScreen