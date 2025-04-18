
import { AppLayout } from '@/components/layout/AppLayout';
import { VideoRecorder } from '@/components/recording/VideoRecorder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Video, MapPin, Copy } from 'lucide-react';

const RecordPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Record Track Video</h1>
          <p className="text-muted-foreground">
            Capture video and GPS data for track inspection
          </p>
        </div>
        
        <Alert>
          <AlertTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Important Information
          </AlertTitle>
          <AlertDescription>
            Please ensure your device has a camera and GPS access. For optimal results, 
            record in good lighting conditions and maintain a consistent speed.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Video Recording</CardTitle>
              <CardDescription>
                Start recording to capture video and GPS data simultaneously
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoRecorder />
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Recording Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Video Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                    <li>Hold camera steady and parallel to tracks</li>
                    <li>Maintain consistent lighting</li>
                    <li>Keep recording under 50MB (approximately 2-3 minutes)</li>
                    <li>Maintain a consistent speed</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  GPS Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">GPS Best Practices</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                    <li>Use outdoors for best GPS accuracy</li>
                    <li>Wait for GPS signal to stabilize before recording</li>
                    <li>Keep device GPS enabled throughout recording</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Processing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    After upload, the system will automatically:
                  </p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Extract frames from your video (1 per second)</li>
                    <li>Process each frame with the crack detection model</li>
                    <li>Match detections with GPS coordinates</li>
                    <li>Store results in your account dashboard</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RecordPage;
