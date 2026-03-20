/**
 * Document processing utilities — ported from benekiva-ai-assist.
 * The ai-assist project calls Supabase Edge Functions; here we provide
 * a mock implementation that returns realistic demo data so the full
 * Document Intelligence page works end-to-end without a backend.
 */

export const readFileForAI = async (
  file: File
): Promise<{ documentText?: string; documentBase64?: string; mimeType: string }> => {
  const mimeType = file.type || "application/octet-stream";
  const isTextBased =
    mimeType.startsWith("text/") ||
    mimeType === "application/json" ||
    mimeType === "application/xml" ||
    file.name.endsWith(".txt") ||
    file.name.endsWith(".csv") ||
    file.name.endsWith(".rtf");

  if (isTextBased) {
    const text = await file.text();
    return { documentText: text, mimeType };
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return { documentBase64: base64, mimeType };
};

/* ---------- mock delay helper ---------- */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------- mock result generators ---------- */

function mockOCR(fileName: string) {
  return {
    extractedText:
      "Patient: John A. Smith\nDOB: 03/15/1952\nPolicy: POL-2024-78901\n\nDiagnosis: Alzheimer's Disease, Stage 3\nDate of Assessment: January 10, 2024\n\nFunctional Limitations:\n- Unable to bathe independently\n- Requires assistance with dressing\n- Needs help transferring from bed to chair\n\nCognitive Assessment:\nMMSE Score: 14/30 (moderate impairment)\nCDR Rating: 2.0\n\nRecommendation: 24-hour supervised care in assisted living facility.",
    confidence: 96,
    detectedLanguages: ["English"],
    textBlocks: [
      { type: "Header", content: "Patient: John A. Smith — DOB: 03/15/1952", confidence: 98 },
      { type: "Clinical", content: "Diagnosis: Alzheimer's Disease, Stage 3 — progressive cognitive decline documented over 18 months", confidence: 96 },
      { type: "Assessment", content: "MMSE Score: 14/30 (moderate impairment); CDR Rating: 2.0", confidence: 94 },
      { type: "Recommendation", content: "24-hour supervised care recommended; currently in assisted living facility", confidence: 92 },
    ],
    pageCount: 3,
  };
}

function mockClassification(fileName: string) {
  return {
    documentType: "Medical Records",
    subType: "Physician Assessment",
    confidence: 94,
    categories: [
      { name: "Long-Term Care", score: 0.92 },
      { name: "Disability Claim", score: 0.78 },
      { name: "Life Insurance", score: 0.15 },
    ],
    keywords: ["Alzheimer's", "cognitive decline", "ADL limitations", "assisted living", "MMSE"],
    language: "English",
    sentiment: "Neutral/Clinical",
  };
}

function mockExtraction(fileName: string) {
  return {
    entities: [
      { field: "Patient Name", value: "John A. Smith", confidence: 98 },
      { field: "Date of Birth", value: "03/15/1952", confidence: 97 },
      { field: "Policy Number", value: "POL-2024-78901", confidence: 99 },
      { field: "Primary Diagnosis", value: "Alzheimer's Disease, Stage 3", confidence: 96 },
      { field: "Physician", value: "Dr. Maria Martinez, Neurology", confidence: 94 },
      { field: "Facility", value: "Sunrise Assisted Living — Unit 4B", confidence: 91 },
      { field: "Assessment Date", value: "01/10/2024", confidence: 98 },
    ],
    tables: [
      {
        title: "ADL Assessment",
        headers: ["Activity", "Independent", "Needs Assistance"],
        rows: [
          ["Bathing", "No", "Yes"],
          ["Dressing", "No", "Yes"],
          ["Transferring", "No", "Yes"],
          ["Eating", "Yes", "No"],
          ["Toileting", "Yes", "No"],
          ["Continence", "Yes", "No"],
        ],
      },
    ],
  };
}

function mockSemantic(fileName: string) {
  return {
    summary:
      "Medical records for John A. Smith (DOB 03/15/1952) document Stage 3 Alzheimer's Disease with progressive cognitive decline over 18 months. Patient is unable to perform 3 of 6 ADLs independently (bathing, dressing, transferring). MMSE score of 14/30 indicates moderate impairment. 24-hour supervised care is recommended.",
    topics: [
      { topic: "Cognitive Decline", relevance: 0.95 },
      { topic: "ADL Limitations", relevance: 0.92 },
      { topic: "Long-Term Care Eligibility", relevance: 0.89 },
      { topic: "Medication Management", relevance: 0.72 },
    ],
    relationships: [
      { from: "Alzheimer's Stage 3", to: "ADL Limitations", type: "causes" },
      { from: "MMSE 14/30", to: "Moderate Impairment", type: "indicates" },
      { from: "ADL Failures (3/6)", to: "LTC Benefit Activation", type: "qualifies" },
    ],
    riskScore: 0.78,
    complianceFlags: [
      "Documentation gap: Feb 2024 – Apr 2024 (2 months missing)",
      "Inconsistent dates between physician notes and lab results",
    ],
  };
}

/**
 * Simulate document processing for a given mode.
 * In production this would call an API / edge function.
 */
export const processDocumentWithAI = async (
  file: File,
  mode: "ocr" | "classification" | "extraction" | "semantic"
) => {
  // Simulate realistic processing time
  const delays: Record<string, number> = { ocr: 1800, classification: 1200, extraction: 1500, semantic: 2000 };
  await delay(delays[mode] ?? 1500);

  const generators: Record<string, (f: string) => unknown> = {
    ocr: mockOCR,
    classification: mockClassification,
    extraction: mockExtraction,
    semantic: mockSemantic,
  };

  return generators[mode](file.name);
};
