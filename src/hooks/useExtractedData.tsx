"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ExtractedClaimantData {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  policyNumber: string | null;
  claimType: string | null;
  diagnosis: string | null;
  dateOfLoss: string | null;
  description: string | null;
}

interface ExtractedDataContextValue {
  extractedData: ExtractedClaimantData | null;
  setExtractedData: (data: ExtractedClaimantData | null) => void;
}

const ExtractedDataContext = createContext<ExtractedDataContextValue | null>(null);

export const ExtractedDataProvider = ({ children }: { children: ReactNode }) => {
  const [extractedData, setExtractedData] = useState<ExtractedClaimantData | null>(null);
  return (
    <ExtractedDataContext.Provider value={{ extractedData, setExtractedData }}>
      {children}
    </ExtractedDataContext.Provider>
  );
};

export const useExtractedData = () => {
  const ctx = useContext(ExtractedDataContext);
  if (!ctx) throw new Error("useExtractedData must be used within ExtractedDataProvider");
  return ctx;
};
