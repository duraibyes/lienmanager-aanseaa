import { Upload, Calendar, Download, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useState } from 'react';
import PdfThumbnail from '../../../utils/PdfThumbnail';
import { MAX_FILE_SIZE } from '../../../types/contact';
import { DocumentViewResponse, ProjectWizardData } from '../../../types/project';
import { useDeleteDocumentMutation } from '../../../features/document/DocumentApi';
import WizardFooterButton from '../../Button/WizardFooterButton';

interface DocumentsStepProps {
    readonly data: File[];
    readonly onUpdate: React.Dispatch<React.SetStateAction<File[]>>;
    readonly onNext: () => void;
    readonly onBack: () => void;
    readonly onSaveAndExit?: () => void;
    readonly uploadedDocuments?: DocumentViewResponse[];
    readonly updateProjectData?: (data: Partial<ProjectWizardData>) => void;
}

export default function DocumentsStep({ data, onUpdate, onNext, onBack, onSaveAndExit, uploadedDocuments, updateProjectData }: DocumentsStepProps) {
    const [previewFile, setPreviewFile] = useState<File | null>(null);
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
        });

        if (result.isConfirmed) {

            try {
                const result = await deleteDocument({ documentId }).unwrap();

                console.log("Refetch result:", result);

                // optional: update wizard document state only
                if (result?.data && updateProjectData) {
                    updateProjectData({
                        uploaded_documents: result.data,
                    });
                }

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const validFiles: File[] = [];
        const invalidFiles: string[] = [];

        files.forEach((file) => {
            if (file.size > MAX_FILE_SIZE) {
                invalidFiles.push(file.name);
            } else {
                validFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: `These files exceed 10MB:\n\n${invalidFiles.join("\n")}`,
            });
        }
        if (validFiles.length > 0) {
            onUpdate((prev) => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index: number) => {
        onUpdate((prev) => prev.filter((_, i) => i !== index));
    };

    const handlePreview = (file: File) => {
        const isImage = file.type.startsWith("image");
        const isPdf = file.type.includes("pdf");

        if (isImage || isPdf) {
            setPreviewFile(file);
        } else {
            // Force download
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-xl md:text-3xl font-bold text-slate-900 mb-3">Upload Documents</h1>
                <p className="text-sm md:text-lg text-slate-600">
                    Add contracts, invoices, change orders, and other relevant documents for this project.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-8">
                <div className="border-2 border-dashed border-slate-300 rounded-xl md:p-12 p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="md:w-16 md:h-16 w-10 h-10 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-md md:text-lg font-semibold text-slate-900 mb-2">
                            Click to upload or drag and drop
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600">
                            PDF, Word, Excel, or Image files (up to 2MB each)
                        </p>
                    </label>
                </div>

                {/* Attachment Grid */}
                <div className='flex flex-wrap gap-4 md:mt-4 mt-2'>

                    {data?.map((file, index) => {
                        if (!file) {
                            return;
                        }
                        const isImage = file.type.startsWith("image");
                        const isPdf = file.type.includes("pdf");

                        return (
                            <div key={index} className="relative border rounded-lg p-2 shadow bg-white w-[150px]" >
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 bg-black/10
    p-[5px]
    rounded
    text-[12px]
    text-gray-700
    transition-all duration-10
    hover:bg-red-500
    hover:text-white
  "
                                >
                                    ✕
                                </button>

                                <div onClick={() => handlePreview(file)} className="cursor-pointer">
                                    {isImage && (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="thumb"
                                            className="h-24 w-full object-cover rounded"
                                        />
                                    )}

                                    {isPdf && <PdfThumbnail file={file} />}

                                    {!isImage && !isPdf && (
                                        <div className="h-24 flex items-center justify-center text-4xl">
                                            📎
                                        </div>
                                    )}

                                    <div className="mt-2 text-sm">
                                        <p className="truncate font-medium">{file.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Preview Modal */}
                {previewFile && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] relative grid grid-cols-2 sm:grid-cols-1 gap-3 p-4">
                            <button
                                onClick={() => setPreviewFile(null)}
                                className="absolute top-2 right-2 text-red-500"
                            >
                                Close
                            </button>

                            <div className="col-span-2 sm:col-span-1 flex items-center justify-center overflow-auto">
                                {previewFile.type.startsWith("image") ? (
                                    <img
                                        src={URL.createObjectURL(previewFile)}
                                        alt="preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <iframe
                                        src={URL.createObjectURL(previewFile)}
                                        title="preview"
                                        className="w-full h-full"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}


                {uploadedDocuments && uploadedDocuments.length > 0 && (
                    <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                        <h3 className="font-semibold text-slate-800">Uploaded Documents</h3>

                        {uploadedDocuments.map((document) => (

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

                                        <span>
                                            {document.file_size}
                                        </span>

                                    </div>

                                    {document.notes && (
                                        <span className="text-xs text-amber-600 truncate">
                                            {document.notes}
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
                )}

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Recommended Documents</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Contract or Purchase Order</li>
                        <li>• Preliminary Notice (if already sent)</li>
                        <li>• Invoices and Payment Applications</li>
                        <li>• Change Orders or Amendments</li>
                        <li>• Proof of Delivery or Work Performed</li>
                    </ul>
                </div>
            </div>

            <WizardFooterButton
                onBack={onBack}
                onSaveAndExit={onSaveAndExit}
                onNext={onNext}
            />
        </div>
    );
}
