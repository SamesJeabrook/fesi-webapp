export interface TableCardProps {
  table: {
    id: string;
    table_number: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved' | 'cleaning';
    current_session_id?: string | null;
    qr_code?: string | null;
    current_session?: {
      id: string;
      guest_count: number;
      seated_at: string;
      server_id?: string;
      server_name?: string;
    };
  };
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}
