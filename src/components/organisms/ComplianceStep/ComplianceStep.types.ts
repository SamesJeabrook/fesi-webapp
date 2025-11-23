export interface ComplianceDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  expiryDate?: Date;
}

export interface ComplianceData {
  hygieneRating?: number; // 0-5 (UK FSA scale)
  hygieneRatingDate?: Date;
  foodSafetyCertificate?: ComplianceDocument;
  publicLiabilityInsurance?: ComplianceDocument;
  allergenTrainingCertificate?: ComplianceDocument;
  additionalDocuments?: ComplianceDocument[];
  confirmedAccuracy: boolean;
}

export interface ComplianceStepProps {
  onComplete: (data: ComplianceData) => void;
  onBack: () => void;
  initialData?: ComplianceData;
  loading?: boolean;
  className?: string;
}
