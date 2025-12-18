export interface ImageUploadProps {
  /**
   * Current image URL or preview URL
   */
  value: string;
  
  /**
   * Callback when a new file is selected
   */
  onChange: (file: File) => void;
  
  /**
   * Callback when the image is removed (optional)
   */
  onRemove?: () => void;
  
  /**
   * Accepted file types
   * @default 'image/*'
   */
  accept?: string;
  
  /**
   * Maximum file size in bytes
   * @default 10485760 (10MB)
   */
  maxSize?: number;
  
  /**
   * Whether the upload is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom text for the upload button
   * @default 'Choose Image'
   */
  buttonText?: string;
  
  /**
   * Button variant
   * @default 'secondary'
   */
  buttonVariant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Additional CSS class for the preview image
   */
  previewClassName?: string;
  
  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;
}
