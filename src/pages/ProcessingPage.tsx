
import { AppLayout } from '@/components/layout/AppLayout';
import { ProcessingInfo } from '@/components/processing/ProcessingInfo';
import { ImageTesting } from '@/components/processing/ImageTesting';

const ProcessingPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Processing Information</h1>
          <p className="text-muted-foreground">
            Track detection progress and manage model settings
          </p>
        </div>
        <ProcessingInfo />
        <ImageTesting />
      </div>
    </AppLayout>
  );
};

export default ProcessingPage;
