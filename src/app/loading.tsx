import { Typography } from '@/components/atoms/Typography';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <Typography variant="body-medium" className="text-neutral-600">Loading...</Typography>
      </div>
    </div>
  );
}
