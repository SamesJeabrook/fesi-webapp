export interface TableInput {
  table_number: string;
  capacity: number;
  location_notes?: string;
}

export interface CreateTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantId: string;
  onTablesCreated?: () => void;
}
