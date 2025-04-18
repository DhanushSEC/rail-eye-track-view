
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatBytes } from '@/lib/utils';
import { useVideoRecording } from '@/hooks/useVideoRecording';
import { useGPSTracking } from '@/hooks/useGPSTracking';
import { VideoPreview } from './VideoPreview';
import { RecordingControls } from './RecordingControls';

export function VideoRecorder() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const {
    isRecording,
    duration,
    size,
    videoURL,
    videoRef,
    startRecording,
    stopRecording
  } = useVideoRecording();

  const {
    gpsCoordinates,
    gpsActive,
    startGPSTracking,
    stopGPSTracking
  } = useGPSTracking();

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        
        setHasPermission(true);
        
        return () => {
          mediaStream.getTracks().forEach(track => track.stop());
        };
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setHasPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Permission Required",
          description: "Please allow camera access to record videos."
        });
      }
    };
    
    requestPermissions();
  }, [toast, videoRef]);

  const handleStartRecording = () => {
    startRecording();
    startGPSTracking();
  };

  const handleStopRecording = () => {
    stopRecording();
    stopGPSTracking();
  };

  const uploadRecording = async () => {
    if (!videoURL || gpsCoordinates.length === 0) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "No recording or GPS data available to upload."
      });
      return;
    }

    const MAX_SIZE = 50 * 1024 * 1024;
    
    if (size > MAX_SIZE) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: `Video exceeds 50MB limit (${formatBytes(size)}). Please record a shorter video.`
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload and processing
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setUploadProgress(i);
      }
      
      const recordingData = {
        id: Date.now().toString(),
        userId: JSON.parse(localStorage.getItem("railAppAuthUser") || '{}').id,
        videoUrl: videoURL,
        gpsData: gpsCoordinates,
        timestamp: new Date().toISOString(),
        size,
        duration
      };
      
      const existingRecordings = JSON.parse(localStorage.getItem("railAppRecordings") || '[]');
      localStorage.setItem(
        "railAppRecordings", 
        JSON.stringify([...existingRecordings, recordingData])
      );
      
      toast({
        title: "Upload Successful",
        description: "Video uploaded and queued for crack detection processing."
      });
      
    } catch (err) {
      console.error('Error uploading recording:', err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not upload the recording. Please try again."
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2">
        <CardContent className="p-0 aspect-video relative bg-black">
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
          
          <RecordingControls
            isRecording={isRecording}
            duration={duration}
            size={size}
            gpsActive={gpsActive}
            gpsCoordinates={gpsCoordinates}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            disabled={!hasPermission || isUploading}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between p-4">
          <Button
            onClick={uploadRecording}
            disabled={!videoURL || isRecording || isUploading}
            variant="outline"
          >
            Upload Recording
          </Button>
        </CardFooter>
      </Card>
      
      {!hasPermission && (
        <Alert variant="destructive">
          <AlertTitle>Permission Required</AlertTitle>
          <AlertDescription>
            Camera and location access are required for recording. 
            Please allow permissions and refresh the page.
          </AlertDescription>
        </Alert>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Uploading video and GPS data...
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}
      
      {videoURL && !isUploading && (
        <VideoPreview
          videoURL={videoURL}
          gpsCoordinates={gpsCoordinates}
        />
      )}
    </div>
  );
}

