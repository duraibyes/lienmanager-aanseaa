import { Filter, Plus, Search } from "lucide-react"
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useGetAllProjectsQuery, useGetProjectDocumentQuery } from "../../features/document/DocumentApi";
import DocumentCard from "../Parts/Document/DocumentCard";
import AddDocumentModal from "../Parts/Document/AddDocumentModal";

const DocumentScreen = () => {
    const location = useLocation();
    const [search, setSearch] = useState("");
    const [selectedProject, setSelectedProject] = useState<number | "all">(location.state?.project_id || "all");
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, isLoading } = useGetProjectDocumentQuery();

    const {data: projects} = useGetAllProjectsQuery();

    const projectOptions = useMemo(() => {
        if (!projects?.data) return [];

        return projects?.data?.map((project) => ({
            id: project.id,
            name: project.project_name,
        }));

    }, [projects]);

    const filteredDocuments = useMemo(() => {

        if (!data?.data) return [];

        return data.data
            .filter((project) => {

                const matchesProject =
                    selectedProject === "all" ||
                    project.project_id === selectedProject;

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

    }, [data, selectedProject, search]);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="mb-6 sm:mb-8 px-3 sm:px-0">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    {/* Title Section */}
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                            Documents
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600">
                            Manage all your project documents in one place
                        </p>
                    </div>

                    {/* Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="
        w-full sm:w-auto
        px-4 sm:px-6 
        py-2.5 sm:py-3
        bg-blue-600 text-white font-semibold 
        rounded-lg hover:bg-blue-700 
        transition-colors 
        flex items-center justify-center gap-2 
        shadow-lg
      "
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Add Document
                    </button>

                </div>


                {/* Search and Filter */}
                <div className="flex flex-col lg:flex-row gap-4">

                    {/* Search */}
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


                    {/* Filter */}
                    <div className="relative w-full lg:w-64">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />

                        <select
                            value={selectedProject}
                            onChange={(e) =>
                                setSelectedProject(
                                    e.target.value === "all"
                                        ? "all"
                                        : Number(e.target.value)
                                )
                            }
                            className="
          w-full
          pl-9 sm:pl-10 pr-8 
          py-2.5 sm:py-3
          text-sm sm:text-base
          border-2 border-slate-300 
          rounded-lg 
          focus:ring-2 focus:ring-blue-500 
          focus:border-transparent
          appearance-none 
          bg-white 
          cursor-pointer
        "
                        >
                            <option value="all">All Projects</option>

                            {projectOptions.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}

                        </select>
                    </div>

                </div>

            </div>
            <div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <DocumentCard filteredDocuments={filteredDocuments} />
                )
                }
            </div >

            {showAddModal && (
                <AddDocumentModal
                    show={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    projects={projectOptions}
                />
            )}
        </div >
    )
}

export default DocumentScreen