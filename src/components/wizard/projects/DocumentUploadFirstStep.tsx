import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, X, ArrowRight } from 'lucide-react';
import { ProjectWizardData } from '../../../types/project';
import { useReadDocumentMutation } from '../../../features/document/DocumentApi';

interface DocumentUploadFirstStepProps {
  data: ProjectWizardData;
  onUpdate: (data: Partial<ProjectWizardData>) => void;
  onNext: () => void;
  onSkip: () => void;
}

interface ExtractedData {
  projectName?: string;
  jobName?: string;
  jobAddress?: string;
  jobCity?: string;
  jobState?: string;
  jobZip?: string;
  contractAmount?: string;
  customerType?: string;
  startDate?: string;
}

export default function DocumentUploadFirstStep({ data, onUpdate, onNext, onSkip }: DocumentUploadFirstStepProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState('');

  const [readDocument, { isLoading }] = useReadDocumentMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setUploadedFile(file);
      setError('');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  console.log('  isLoading ', isLoading, data);

  const extractDataFromDocuments = async () => {
    if (!uploadedFile) {
      setError('Please upload a document');
      return;
    }

    setExtracting(true);
    setError('');

    try {
      const result = await readDocument({ document: uploadedFile }).unwrap();

      if(result.status) {
        const docData = result.data;
        const mockExtractedData: ExtractedData = {
          projectName: docData.project_details?.project_name,
          jobName: docData.project_details?.project_name,
          jobAddress: docData.basic_details?.address,
          jobCity: docData.basic_details?.city,
          jobState: docData.basic_details?.state,
          jobZip: docData.basic_details?.zip,
          contractAmount: docData?.amounts[0]?.amount || 0,
          customerType: docData?.project_details?.role,
          startDate: docData.agreement?.project_start_date
        };
  
        setExtractedData(mockExtractedData);
        onUpdate({
          projectName: mockExtractedData.projectName,
          jobName: mockExtractedData.jobName,
          jobAddress: mockExtractedData.jobAddress,
          jobCity: mockExtractedData.jobCity,
          jobStateId: mockExtractedData.jobState ? parseInt(mockExtractedData.jobState, 10) : 0,
          jobZip: mockExtractedData.jobZip,
          contractAmount: mockExtractedData.contractAmount,
          // customerType: mockExtractedData.customerType,
          startDate: mockExtractedData.startDate
        });
      }

    } catch (err) {
      console.log(' data error ', err);
      setError('Failed to extract data from documents');
    } finally {
      setExtracting(false);
    }
  };

  const handleProceed = () => {
    if (extractedData) {
      onNext();
    } else if (uploadedFile) {
      extractDataFromDocuments();
    } else {
      setError('Please upload documents or skip to manual entry');
    }
  };

  return (
    <div className="max-w-4xl mx-auto md:p-8 md:py-12 p-4">
      <div className="mb-8 text-center">
        <div className="w-10 md:w-16 h-10 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-4 md:w-8 h-4 md:h-8 text-blue-600" />
        </div>
        <h1 className="md:text-3xl text-xl font-bold text-slate-900 mb-3">Upload Your Project Documents</h1>
        <p className="md:text-lg text-md text-slate-600">
          Upload contracts, agreements, or project documents and we'll automatically extract the information for you.
        </p>
      </div>

      <div className="bg-white rounded-xl border-2 border-slate-200 md:p-8 p-4 space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-xl md:p-12 p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer relative">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-8 md:w-12 h-8 md:h-12 text-slate-400 mx-auto md:mb-4 mb-2" />
          <h3 className="md:text-xl text-md font-semibold text-slate-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="md:text-sm text-xs text-slate-600">
            Supports PDF, DOC, DOCX (Max 2MB per file)
          </p>
        </div>

        {uploadedFile && (
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Uploaded File</h3>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">

              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {uploadedFile.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <button
                onClick={removeFile}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>

            </div>
          </div>
        )}

        {extracting && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Loader className="w-8 h-8 text-blue-600 mx-auto mb-3 animate-spin" />
            <h3 className="font-semibold text-blue-900 mb-2">Extracting Information...</h3>
            <p className="text-sm text-blue-800">
              Analyzing your documents and extracting project details. This may take a moment.
            </p>
          </div>
        )}

        {extractedData && !extracting && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-green-900 mb-2">Data Extracted Successfully!</h3>
                <p className="text-sm text-green-800 mb-4">
                  We've extracted the following information from your documents. You can review and edit this information in the next steps.
                </p>

                <div className="grid md:grid-cols-2 gap-3 text-sm bg-white rounded-lg p-4 border border-green-200">
                  {extractedData.projectName && (
                    <div>
                      <span className="font-semibold text-slate-700">Project Name:</span>
                      <span className="text-slate-900 ml-2">{extractedData.projectName}</span>
                    </div>
                  )}
                  {extractedData.jobAddress && (
                    <div>
                      <span className="font-semibold text-slate-700">Address:</span>
                      <span className="text-slate-900 ml-2">{extractedData.jobAddress}</span>
                    </div>
                  )}
                  {extractedData.jobCity && (
                    <div>
                      <span className="font-semibold text-slate-700">City:</span>
                      <span className="text-slate-900 ml-2">{extractedData.jobCity}, {extractedData.jobState} {extractedData.jobZip}</span>
                    </div>
                  )}
                  {extractedData.contractAmount && (
                    <div>
                      <span className="font-semibold text-slate-700">Contract Amount:</span>
                      <span className="text-slate-900 ml-2">${extractedData.contractAmount}</span>
                    </div>
                  )}
                  {extractedData.startDate && (
                    <div>
                      <span className="font-semibold text-slate-700">Start Date:</span>
                      <span className="text-slate-900 ml-2">{extractedData.startDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>1. Upload your contract, agreement, or project documents</li>
            <li>2. Our AI will automatically extract key information like project name, address, amounts, and dates</li>
            <li>3. Review the extracted data and make any necessary edits in the following steps</li>
            <li>4. Complete your project setup with pre-filled information</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between mt-8 gap-2">
        <button
          onClick={onSkip}
          className="px-3 py-3 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          Skip & Enter Manually
        </button>

        {extractedData ? (
          <button
            onClick={onNext}
            className="px-4 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            Continue to Review & Edit
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            disabled={extracting || !uploadedFile}
            className="px-4 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg"
          >
            {extracting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Extract Information
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
