export interface BusinessDetailsStepProps {
  onComplete: (data: BusinessDetailsData) => void;
  onBack: () => void;
  initialData?: Partial<BusinessDetailsData>;
  loading?: boolean;
  className?: string;
}

export interface BusinessDetailsData {
  businessName: string;
  description: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  categories: string[];
}
