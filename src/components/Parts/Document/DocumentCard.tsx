import { Calendar, Download, File, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { ProjectDocumentResponse, useDeleteDocumentMutation } from "../../../features/document/DocumentApi";
import { useState } from "react";
import AddDocumentModal from "./AddDocumentModal";

type DocumentCardProps = {
    filteredDocuments: ProjectDocumentResponse[]
}

const DocumentCard = ({ filteredDocuments }: DocumentCardProps) => {

    const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
    const [showModal, setShowModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    const handleDeleteDocument = async (documentId: number, title: string) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete "${title}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mx-2",

                cancelButton:
                    "bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mx-2",
            },
        });

        if (result.isConfirmed) {

            try {
                await deleteDocument({ documentId }).unwrap();

                Swal.fire({
                    title: "Deleted!",
                    text: "Document has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });

            } catch (error) {

                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete document.",
                    icon: "error",
                });

            }
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedProjectId(null);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocuments?.map((doc) => (
                <div
                    key={doc.project_id}
                    className="bg-white 
        rounded-xl 
        border border-slate-200 
        hover:border-blue-300 
        hover:shadow-lg 
        transition-all
        p-5
        flex flex-col"
                >
                    <div className="flex items-center justify-between mb-4 border-b pb-3">

                        <div className="flex items-center gap-3 justify-between w-full">

                            <div className="bg-blue-100 p-2 rounded-lg">
                                <File className="w-5 h-5 text-blue-600" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    {doc.project_name}
                                </h3>

                                <p className="text-xs text-slate-500">
                                    {doc.documents.length} document(s)
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        setSelectedProjectId(doc.project_id);
                                        setShowModal(true);
                                    }}
                                    title="Add Document"
                                    className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 shadow-lg">
                                    <Plus className="w-4 h-4 " />
                                </button>
                            </div>

                        </div>

                    </div>
                    <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">

                        {doc.documents.map((document) => (

                            <div
                                key={document.id}
                                className="
              border border-slate-200 
              rounded-lg 
              p-3
              hover:bg-slate-50
              transition
              flex justify-between items-start
            "
                            >
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <span className="font-medium text-slate-800 truncate">
                                        {document.title}
                                    </span>

                                    <div className="flex items-center gap-4 text-xs text-slate-500">

                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {document.date}
                                        </span>

                                        {/* <span>
                                            {document.file_size}
                                        </span> */}

                                    </div>

                                    {document.note && (
                                        <span className="text-xs text-amber-600 truncate">
                                            {document.note}
                                        </span>
                                    )}

                                </div>


                                {/* Right side actions */}
                                <div className="flex gap-1 ml-3">

                                    <a
                                        href={document.file_url}
                                        target="_blank"
                                        className="
                  p-2 
                  text-blue-600 
                  hover:bg-blue-50 
                  rounded-md
                "
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>

                                    <button
                                        className="p-2 
                  text-red-600 
                  hover:bg-red-50 
                  rounded-md
                "
                                        disabled={isDeleting}
                                        onClick={() => handleDeleteDocument(document.id, document.title)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>
            ))}

            {showModal && 
            <AddDocumentModal show={showModal} projectId={selectedProjectId} onClose={handleModalClose} /> }
        </div>
    )
}

export default DocumentCard