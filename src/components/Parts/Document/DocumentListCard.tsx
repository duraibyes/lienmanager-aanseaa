import Swal from "sweetalert2";
import { Calendar, Download, Trash2 } from "lucide-react"
import { Document, useDeleteDocumentMutation } from "../../../features/document/DocumentApi";

type DocumentProps = {
    document: Document;
}
const DocumentListCard = ({ document }: DocumentProps) => {

    const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

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
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await deleteDocument({ documentId }).unwrap();
                } catch (error) {
                    Swal.showValidationMessage("Failed to delete document");
                }
            },
            allowOutsideClick: () => !Swal.isLoading(),
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Document has been deleted.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    return (
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

                </div>

                {document.note && (
                    <span className="text-xs text-amber-600 truncate">
                        {document.note}
                    </span>
                )}
            </div>
            <div className="flex gap-1 ml-3">

                <a
                    href={document.file_url}
                    target="_blank"
                    className=" p-2  text-primary  hover:bg-blue-50  rounded-md"
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
    )
}

export default DocumentListCard