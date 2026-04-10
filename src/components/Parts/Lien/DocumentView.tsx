import { Download, FileText } from "lucide-react";
import { DocumentViewResponse } from "../../../types/project";
import { formatDate } from "../../../utils/common";

type Props = {
    readonly uploadedDocuments: DocumentViewResponse[];
}

const DocumentView = ({ uploadedDocuments }: Props) => {
    return (
        <div className="space-y-3">
            {uploadedDocuments.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500">No documents uploaded</p>
                </div>
            ) : (
                uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <FileText className="w-5 h-5 text-blue-600 mt-1" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 break-words">{doc.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                                        <span className="text-sm text-gray-500">{doc.file_extension}</span>
                                        <span className="text-sm text-gray-400">•</span>
                                        <span className="text-sm text-gray-500">
                                            {doc.file_size}
                                        </span>
                                        <span className="text-sm text-gray-400">•</span>
                                        <span className="text-sm text-gray-500">{formatDate(doc.date)}</span>
                                    </div>
                                    {doc.notes && (
                                        <p className="text-sm text-gray-600 mt-2">{doc.notes}</p>
                                    )}
                                </div>
                                <div className="flex sm:block justify-end">
                                    <a
                                        href={doc.file_url}
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
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default DocumentView