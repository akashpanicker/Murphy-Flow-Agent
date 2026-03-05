export interface ProcurementLineItem {
  itemName: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
}

export interface ParsedProcurementData {
  requestId?: string;
  subRequestId?: string;
  title?: string;
  description?: string;
  requestor?: string;
  category?: string;
  priority?: string;
  status?: string;
  startDate?: string;
  dueDate?: string;
  followupDate?: string;
  triageDate?: string;
  lineItems?: ProcurementLineItem[];
}

export type ParsedFieldKey = Exclude<keyof ParsedProcurementData, "lineItems">;

export interface DocumentParseResult {
  data: ParsedProcurementData;
  autofilledFields: Array<ParsedFieldKey | "lineItems">;
  source: "endpoint" | "heuristic";
  warnings?: string[];
}

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "image/jpg",
]);

const DATE_REGEX = /(\d{4}-\d{2}-\d{2}|\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/;

const FIELD_PATTERNS: Record<ParsedFieldKey, RegExp[]> = {
  requestId: [
    /(?:request\s*id|request\s*#|req\s*id)\s*[:\-]\s*([^\n\r,;]+)/i,
    /\b([A-Z]{2,6}-\d{2,})\b/,
  ],
  subRequestId: [/(?:sub\s*request\s*id|sub\s*request\s*#)\s*[:\-]\s*([^\n\r,;]+)/i],
  title: [/(?:title|subject|request\s*title)\s*[:\-]\s*([^\n\r]+)/i],
  description: [/(?:description|details|scope)\s*[:\-]\s*([^\n\r]+)/i],
  requestor: [/(?:requestor|requester|requested\s*by)\s*[:\-]\s*([^\n\r,;]+)/i],
  category: [/(?:category|commodity|department)\s*[:\-]\s*([^\n\r,;]+)/i],
  priority: [/(?:priority|urgency)\s*[:\-]\s*([^\n\r,;]+)/i],
  status: [/(?:status|state)\s*[:\-]\s*([^\n\r,;]+)/i],
  startDate: [/(?:request\s*start\s*date|start\s*date)\s*[:\-]\s*([^\n\r]+)/i],
  dueDate: [/(?:due\s*date|needed\s*by|required\s*by)\s*[:\-]\s*([^\n\r]+)/i],
  followupDate: [/(?:follow[\s-]*up\s*date|follow[\s-]*up)\s*[:\-]\s*([^\n\r]+)/i],
  triageDate: [/(?:triage\s*date)\s*[:\-]\s*([^\n\r]+)/i],
};

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const toYyyyMmDd = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const mdyOrDmy = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (mdyOrDmy) {
    let first = Number(mdyOrDmy[1]);
    let second = Number(mdyOrDmy[2]);
    let year = Number(mdyOrDmy[3]);

    if (year < 100) year += 2000;

    let month = first;
    let day = second;

    if (first > 12 && second <= 12) {
      month = second;
      day = first;
    }

    const date = new Date(year, month - 1, day);
    if (!Number.isNaN(date.getTime())) {
      const isoYear = date.getFullYear();
      const isoMonth = `${date.getMonth() + 1}`.padStart(2, "0");
      const isoDay = `${date.getDate()}`.padStart(2, "0");
      return `${isoYear}-${isoMonth}-${isoDay}`;
    }
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const isoYear = parsed.getFullYear();
    const isoMonth = `${parsed.getMonth() + 1}`.padStart(2, "0");
    const isoDay = `${parsed.getDate()}`.padStart(2, "0");
    return `${isoYear}-${isoMonth}-${isoDay}`;
  }

  return undefined;
};

const extractFirst = (text: string, patterns: RegExp[]): string | undefined => {
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    const value = toStringValue(match?.[1]);
    if (value) {
      return value;
    }
  }
  return undefined;
};

const looksNumeric = (value: string): boolean => /^\$?\d[\d,]*(?:\.\d+)?$/.test(value.trim());

const normalizeNumeric = (value: string): string => value.replace(/[$,\s]/g, "").trim();

const extractLineItems = (text: string): ProcurementLineItem[] => {
  const results: ProcurementLineItem[] = [];
  const seen = new Set<string>();
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    if (/item\s*name|quantity|unit\s*price|total\s*price/i.test(line)) {
      continue;
    }

    const csv = line.replace(/[\t|]/g, ",");
    const parts = csv.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 4) {
      const [itemName, quantity, unitPrice, totalPrice] = parts;
      if (itemName && looksNumeric(quantity) && looksNumeric(unitPrice) && looksNumeric(totalPrice)) {
        const lineItem: ProcurementLineItem = {
          itemName,
          quantity: normalizeNumeric(quantity),
          unitPrice: normalizeNumeric(unitPrice),
          totalPrice: normalizeNumeric(totalPrice),
        };
        const dedupe = JSON.stringify(lineItem);
        if (!seen.has(dedupe)) {
          seen.add(dedupe);
          results.push(lineItem);
        }
      }
    }
  }

  if (results.length > 0) {
    return results.slice(0, 25);
  }

  const rowPattern = /([A-Za-z][A-Za-z0-9\s\-\/&]{2,}?)\s{2,}(\d+(?:\.\d+)?)\s{2,}(\$?\d[\d,]*(?:\.\d{1,2})?)\s{2,}(\$?\d[\d,]*(?:\.\d{1,2})?)/g;
  for (const match of text.matchAll(rowPattern)) {
    const itemName = toStringValue(match[1]);
    if (!itemName) continue;

    const lineItem: ProcurementLineItem = {
      itemName,
      quantity: normalizeNumeric(match[2]),
      unitPrice: normalizeNumeric(match[3]),
      totalPrice: normalizeNumeric(match[4]),
    };

    const dedupe = JSON.stringify(lineItem);
    if (!seen.has(dedupe)) {
      seen.add(dedupe);
      results.push(lineItem);
    }
  }

  return results.slice(0, 25);
};

const buildHeuristicExtraction = async (file: File): Promise<DocumentParseResult> => {
  const extractedText = await readExtractableText(file);
  const filenameWithoutExt = file.name.replace(/\.[^.]+$/, "").trim();
  const normalizedFilenameTitle = filenameWithoutExt.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  const sourceText = [file.name, extractedText].filter(Boolean).join("\n");

  const data: ParsedProcurementData = {
    requestId: extractFirst(sourceText, FIELD_PATTERNS.requestId),
    subRequestId: extractFirst(sourceText, FIELD_PATTERNS.subRequestId),
    title: extractFirst(sourceText, FIELD_PATTERNS.title) ?? normalizedFilenameTitle,
    description: extractFirst(sourceText, FIELD_PATTERNS.description),
    requestor: extractFirst(sourceText, FIELD_PATTERNS.requestor),
    category: extractFirst(sourceText, FIELD_PATTERNS.category),
    priority: extractFirst(sourceText, FIELD_PATTERNS.priority),
    status: extractFirst(sourceText, FIELD_PATTERNS.status),
    startDate: toYyyyMmDd(extractDateValue(sourceText, FIELD_PATTERNS.startDate)),
    dueDate: toYyyyMmDd(extractDateValue(sourceText, FIELD_PATTERNS.dueDate)),
    followupDate: toYyyyMmDd(extractDateValue(sourceText, FIELD_PATTERNS.followupDate)),
    triageDate: toYyyyMmDd(extractDateValue(sourceText, FIELD_PATTERNS.triageDate)),
    lineItems: extractLineItems(extractedText),
  };

  const autofilledFields = getAutofilledFields(data);

  if (autofilledFields.length === 0) {
    throw new Error("Unable to extract data from document. Please fill the form manually.");
  }

  return {
    data,
    autofilledFields,
    source: "heuristic",
  };
};

const extractDateValue = (text: string, patterns: RegExp[]): string | undefined => {
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    const raw = toStringValue(match?.[1]);
    if (!raw) continue;

    const dateMatch = raw.match(DATE_REGEX);
    if (dateMatch) {
      return dateMatch[1];
    }
  }

  return undefined;
};

const getAutofilledFields = (data: ParsedProcurementData): Array<ParsedFieldKey | "lineItems"> => {
  const fields: Array<ParsedFieldKey | "lineItems"> = [];

  const textFields: ParsedFieldKey[] = [
    "requestId",
    "subRequestId",
    "title",
    "description",
    "requestor",
    "category",
    "priority",
    "status",
    "startDate",
    "dueDate",
    "followupDate",
    "triageDate",
  ];

  for (const key of textFields) {
    if (toStringValue(data[key])) {
      fields.push(key);
    }
  }

  if (Array.isArray(data.lineItems) && data.lineItems.length > 0) {
    fields.push("lineItems");
  }

  return fields;
};

const readExtractableText = async (file: File): Promise<string> => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const textExtensions = new Set(["txt", "csv", "json", "md", "xml"]);

  if (file.type.startsWith("text/") || (extension && textExtensions.has(extension))) {
    return (await file.text()).slice(0, 200000);
  }

  return "";
};

const normalizeLineItems = (value: unknown): ProcurementLineItem[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const normalized = value
    .map((raw) => {
      if (!raw || typeof raw !== "object") return null;
      const row = raw as Record<string, unknown>;
      const itemName = toStringValue(row.itemName ?? row.name ?? row.item ?? row.description);
      if (!itemName) return null;

      return {
        itemName,
        quantity: toStringValue(row.quantity ?? row.qty) ?? "",
        unitPrice: toStringValue(row.unitPrice ?? row.unit_price ?? row.price) ?? "",
        totalPrice: toStringValue(row.totalPrice ?? row.total_price ?? row.amount) ?? "",
      };
    })
    .filter((item): item is ProcurementLineItem => item !== null);

  return normalized.length > 0 ? normalized : undefined;
};

const normalizeEndpointPayload = (payload: unknown): DocumentParseResult => {
  const parsed = (payload ?? {}) as Record<string, unknown>;
  const dataNode = parsed.data && typeof parsed.data === "object" ? (parsed.data as Record<string, unknown>) : parsed;

  const data: ParsedProcurementData = {
    requestId: toStringValue(dataNode.requestId ?? dataNode.request_id),
    subRequestId: toStringValue(dataNode.subRequestId ?? dataNode.sub_request_id),
    title: toStringValue(dataNode.title),
    description: toStringValue(dataNode.description),
    requestor: toStringValue(dataNode.requestor ?? dataNode.requester),
    category: toStringValue(dataNode.category),
    priority: toStringValue(dataNode.priority),
    status: toStringValue(dataNode.status),
    startDate: toYyyyMmDd(toStringValue(dataNode.startDate ?? dataNode.requestStartDate ?? dataNode.start_date)),
    dueDate: toYyyyMmDd(toStringValue(dataNode.dueDate ?? dataNode.due_date)),
    followupDate: toYyyyMmDd(toStringValue(dataNode.followupDate ?? dataNode.follow_up_date)),
    triageDate: toYyyyMmDd(toStringValue(dataNode.triageDate ?? dataNode.triage_date)),
    lineItems: normalizeLineItems(dataNode.lineItems ?? dataNode.items),
  };

  const autofilledFields = getAutofilledFields(data);

  if (autofilledFields.length === 0) {
    throw new Error("Unable to extract data from document. Please fill the form manually.");
  }

  return {
    data,
    autofilledFields,
    source: "endpoint",
  };
};

const parseWithEndpoint = async (file: File): Promise<DocumentParseResult | null> => {
  const endpoint = import.meta.env.VITE_DOCUMENT_PARSER_ENDPOINT as string | undefined;
  if (!endpoint) return null;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Document parsing request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return normalizeEndpointPayload(payload);
};

export const parseDocument = async (file: File): Promise<DocumentParseResult> => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const supportedByExtension = extension ? ["pdf", "docx", "xlsx", "png", "jpg", "jpeg", "txt", "csv", "json"].includes(extension) : false;
  const supported = ALLOWED_TYPES.has(file.type) || supportedByExtension;

  if (!supported) {
    throw new Error("Unsupported file type. Please upload PDF, DOCX, XLSX, or image files.");
  }

  try {
    const endpointResult = await parseWithEndpoint(file);
    if (endpointResult) {
      return endpointResult;
    }
  } catch {
    // Fall back to local heuristic extraction so the flow still works if remote parsing fails.
  }

  return buildHeuristicExtraction(file);
};
