import { Upload, ChevronLeft, ChevronDown, Send, FileText, Image as ImageIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { AppLayout } from '../components/layout/AppLayout';
import type { ParsedFieldKey, ParsedProcurementData, ProcurementLineItem } from '../../services/documentParser';

interface RequestFormValues {
  requestId: string;
  subRequestId: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  assignedTo: string;
  requestor: string;
  startDate: string;
  dueDate: string;
  followupDate: string;
  triageDate: string;
}

type RequestFormLocationState = {
  fileName?: string;
  fileUrl?: string;
  fileType?: string;
  extractedData?: ParsedProcurementData;
  autofilledFields?: Array<ParsedFieldKey | 'lineItems'>;
  parseError?: string;
};

const EMPTY_VALUES: RequestFormValues = {
  requestId: '',
  subRequestId: '',
  title: '',
  description: '',
  category: '',
  status: '',
  priority: '',
  assignedTo: '',
  requestor: '',
  startDate: '',
  dueDate: '',
  followupDate: '',
  triageDate: '',
};

const EMPTY_LINE_ITEM: ProcurementLineItem = {
  itemName: '',
  quantity: '',
  unitPrice: '',
  totalPrice: '',
};

const mapExtractedDataToFormValues = (data?: ParsedProcurementData): RequestFormValues => ({
  ...EMPTY_VALUES,
  requestId: data?.requestId ?? '',
  subRequestId: data?.subRequestId ?? '',
  title: data?.title ?? '',
  description: data?.description ?? '',
  category: data?.category ?? '',
  status: data?.status ?? '',
  priority: data?.priority ?? '',
  requestor: data?.requestor ?? '',
  startDate: data?.startDate ?? '',
  dueDate: data?.dueDate ?? '',
  followupDate: data?.followupDate ?? '',
  triageDate: data?.triageDate ?? '',
});

export function RequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as RequestFormLocationState;
  const { fileName, fileUrl, fileType, parseError } = state;

  const [isOpen, setIsOpen] = useState(true);
  const [formValues, setFormValues] = useState<RequestFormValues>(() => mapExtractedDataToFormValues(state.extractedData));
  const [lineItems, setLineItems] = useState<ProcurementLineItem[]>(() => {
    if (state.extractedData?.lineItems?.length) {
      return state.extractedData.lineItems;
    }
    return [{ ...EMPTY_LINE_ITEM }];
  });

  const autoFilledFieldSet = useMemo(
    () => new Set(state.autofilledFields ?? []),
    [state.autofilledFields],
  );

  const isPDF = fileType === 'application/pdf';
  const isImage = fileType?.startsWith('image/');

  const filledCount = Object.values(formValues).filter((value) => value.trim().length > 0).length;
  const totalFields = Object.keys(EMPTY_VALUES).length;

  const updateField = (field: keyof RequestFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const updateLineItem = (index: number, field: keyof ProcurementLineItem, value: string) => {
    setLineItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addLineItem = () => {
    setLineItems((prev) => [...prev, { ...EMPTY_LINE_ITEM }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems((prev) => {
      if (prev.length === 1) {
        return [{ ...EMPTY_LINE_ITEM }];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const renderFieldLabel = (field: ParsedFieldKey, htmlFor: string, text: string) => (
    <div className="flex items-center justify-between gap-2">
      <Label htmlFor={htmlFor} className="text-sm text-gray-700">{text}</Label>
      {autoFilledFieldSet.has(field) && (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Extracted from document
        </span>
      )}
    </div>
  );

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Upload className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">New Procurement Request</h1>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Send className="w-4 h-4" />
          Submit
        </button>
      </div>

      <button
        onClick={() => navigate('/new-request')}
        className="mb-6 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Upload
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-gray-900">Procurement Form</h2>
          </div>

          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Procurement Request Form</h3>

            {parseError && (
              <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Unable to extract data from document. Please fill the form manually.
              </div>
            )}

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4">
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                <span className="font-medium">Request Info</span>
                <span className="text-sm text-gray-500">({filledCount}/{totalFields} filled)</span>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    {renderFieldLabel('requestId', 'requestId', 'Request ID')}
                    <Input id="requestId" className="mt-1" value={formValues.requestId} onChange={(e) => updateField('requestId', e.target.value)} />
                  </div>
                  <div>
                    {renderFieldLabel('subRequestId', 'subRequestId', 'Sub Request ID')}
                    <Input id="subRequestId" className="mt-1" value={formValues.subRequestId} onChange={(e) => updateField('subRequestId', e.target.value)} />
                  </div>
                  <div>
                    {renderFieldLabel('title', 'title', 'Title')}
                    <Input id="title" className="mt-1" value={formValues.title} onChange={(e) => updateField('title', e.target.value)} />
                  </div>
                </div>

                <div>
                  {renderFieldLabel('description', 'description', 'Description')}
                  <Textarea id="description" className="mt-1 h-24" value={formValues.description} onChange={(e) => updateField('description', e.target.value)} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    {renderFieldLabel('category', 'category', 'Category')}
                    <Input id="category" className="mt-1" value={formValues.category} onChange={(e) => updateField('category', e.target.value)} />
                  </div>
                  <div>
                    {renderFieldLabel('status', 'status', 'Status')}
                    <Input id="status" className="mt-1" value={formValues.status} onChange={(e) => updateField('status', e.target.value)} />
                  </div>
                  <div>
                    {renderFieldLabel('priority', 'priority', 'Priority')}
                    <Input id="priority" className="mt-1" value={formValues.priority} onChange={(e) => updateField('priority', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="assignedTo" className="text-sm text-gray-700">Assigned To</Label>
                    <Input id="assignedTo" className="mt-1" value={formValues.assignedTo} onChange={(e) => updateField('assignedTo', e.target.value)} />
                  </div>
                  <div>
                    {renderFieldLabel('requestor', 'requestor', 'Requestor')}
                    <Input id="requestor" className="mt-1" value={formValues.requestor} onChange={(e) => updateField('requestor', e.target.value)} />
                  </div>
                  <div>
                    {renderFieldLabel('startDate', 'startDate', 'Request Start Date')}
                    <Input id="startDate" type="date" className="mt-1" value={formValues.startDate} onChange={(e) => updateField('startDate', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    {renderFieldLabel('dueDate', 'dueDate', 'Due Date')}
                    <Input id="dueDate" type="date" className="mt-1" value={formValues.dueDate} onChange={(e) => updateField('dueDate', e.target.value)} />
                  </div>
                  <div>
                    {renderFieldLabel('followupDate', 'followupDate', 'Follow-up Date')}
                    <Input id="followupDate" type="date" className="mt-1" value={formValues.followupDate} onChange={(e) => updateField('followupDate', e.target.value)} />
                  </div>
                  <div>
                    {renderFieldLabel('triageDate', 'triageDate', 'Triage Date')}
                    <Input id="triageDate" type="date" className="mt-1" value={formValues.triageDate} onChange={(e) => updateField('triageDate', e.target.value)} />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E7EB]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">Line Items</span>
                      {autoFilledFieldSet.has('lineItems') && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Extracted from document
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
                      onClick={addLineItem}
                    >
                      Add Line Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {lineItems.map((lineItem, index) => (
                      <div key={`${index}-${lineItem.itemName}`} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-12 lg:col-span-4">
                          <Label className="text-xs text-gray-600">Item Name</Label>
                          <Input
                            value={lineItem.itemName}
                            onChange={(e) => updateLineItem(index, 'itemName', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-4 lg:col-span-2">
                          <Label className="text-xs text-gray-600">Quantity</Label>
                          <Input
                            value={lineItem.quantity}
                            onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-4 lg:col-span-2">
                          <Label className="text-xs text-gray-600">Unit Price</Label>
                          <Input
                            value={lineItem.unitPrice}
                            onChange={(e) => updateLineItem(index, 'unitPrice', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-4 lg:col-span-2">
                          <Label className="text-xs text-gray-600">Total Price</Label>
                          <Input
                            value={lineItem.totalPrice}
                            onChange={(e) => updateLineItem(index, 'totalPrice', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-12 lg:col-span-2">
                          <button
                            type="button"
                            className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                            onClick={() => removeLineItem(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Uploaded Document</h2>
          </div>

          <div className="p-6">
            {fileName ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  {isPDF ? (
                    <FileText className="w-5 h-5 text-red-500" />
                  ) : isImage ? (
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-sm text-gray-700">{fileName}</span>
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {isPDF ? (
                    <iframe
                      src={fileUrl}
                      className="w-full h-[700px]"
                      title="PDF Viewer"
                    />
                  ) : isImage ? (
                    <div className="bg-gray-100 p-4">
                      <img
                        src={fileUrl}
                        alt={fileName}
                        className="w-full h-auto max-h-[700px] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-12 text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 mb-2">{fileName}</p>
                      <p className="text-sm text-gray-500">
                        Preview not available for this file type
                      </p>
                      <a
                        href={fileUrl}
                        download={fileName}
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Download File
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="border border-gray-300 rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No document uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
