import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AppLayout } from '../components/layout/AppLayout';
import { parseDocument, type ParsedFieldKey, type ParsedProcurementData } from '../../services/documentParser';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';

type UploadNavigationState = {
  fromPath?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  extractedData?: ParsedProcurementData;
  autofilledFields?: Array<ParsedFieldKey | 'lineItems'>;
  parseError?: string;
};

type NewRequestLocationState = {
  fromPath?: string;
};

const PATH_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/open-items': 'Open Items',
  '/users': 'Users',
  '/requester-mapping': 'Requester Mapping',
};

export function UploadRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state || {}) as NewRequestLocationState;
  const sourcePath =
    locationState.fromPath && locationState.fromPath !== '/new-request'
      ? locationState.fromPath
      : undefined;
  const sourceLabel = sourcePath ? (PATH_LABELS[sourcePath] ?? 'Previous Page') : undefined;
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setLocalError(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setLocalError(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setLocalError(null);

    const fileUrl = URL.createObjectURL(selectedFile);
    let extractedData: ParsedProcurementData | undefined;
    let autofilledFields: Array<ParsedFieldKey | 'lineItems'> | undefined;
    let parseError: string | undefined;

    try {
      const parsed = await parseDocument(selectedFile);
      extractedData = parsed.data;
      autofilledFields = parsed.autofilledFields;
    } catch {
      parseError = 'Unable to extract data from document. Please fill the form manually.';
      setLocalError(parseError);
    }

    const state: UploadNavigationState = {
      fromPath: sourcePath,
      fileName: selectedFile.name,
      fileUrl,
      fileType: selectedFile.type,
      extractedData,
      autofilledFields,
      parseError,
    };

    navigate('/request-form', { state });
    setIsProcessing(false);
  };

  return (
    <AppLayout>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          {sourcePath && sourceLabel && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={sourcePath}>{sourceLabel}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>New Procurement Request</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">New Procurement Request</h1>
      </div>

      <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-700 mb-1">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-gray-500">PDF, DOCX, XLSX, PNG, JPG</p>
              {selectedFile && (
                <p className="text-sm text-blue-700 mt-2 font-medium">
                  Selected: {selectedFile.name}
                </p>
              )}
              {isProcessing && (
                <p className="text-sm text-blue-700 mt-2 animate-pulse">Processing document...</p>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
            onChange={handleChange}
          />
        </div>

        {localError && (
          <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            {localError}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing}
          className="mt-6 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing document...' : 'Upload'}
        </button>
      </div>
    </AppLayout>
  );
}
