
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Video, Stop, MapPin, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatBytes, formatDuration } from '@/lib/utils';

interface GPSCoordinate {
  timestamp: string;
  latitude: number;
  longitude: number;
}

export function VideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [size, setSize] = useState(0);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [gpsCoordinates, setGpsCoordinates] = useState<GPSCoordinate[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [gpsActive, setGpsActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationTimerRef = useRef<number | null>(null);
  const gpsTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Request permissions when component mounts
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
        
        // Clean up on unmount
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
  }, [toast]);

  const startGPSTracking = () => {
    if (navigator.geolocation) {
      // Check if geolocation is available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsActive(true);
          logGPSCoordinate(position);
          
          // Set up interval for recording GPS coordinates
          gpsTimerRef.current = window.setInterval(() => {
            navigator.geolocation.getCurrentPosition(
              logGPSCoordinate,
              (err) => console.error('GPS error:', err)
            );
          }, 1000);
        },
        (err) => {
          console.error('GPS permission error:', err);
          toast({
            variant: "destructive",
            title: "Location Permission Required",
            description: "Please allow location access to record GPS coordinates."
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation features."
      });
    }
  };

  const logGPSCoordinate = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    const timestamp = new Date().toISOString();
    
    setGpsCoordinates(prev => [
      ...prev,
      { timestamp, latitude, longitude }
    ]);
  };

  const startRecording = async () => {
    if (!hasPermission) return;
    
    try {
      const mediaStream = videoRef.current?.srcObject as MediaStream;
      
      if (!mediaStream) {
        throw new Error('No media stream available');
      }
      
      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          // Update size estimate
          setSize(prevSize => prevSize + event.data.size);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
      };
      
      // Start recording
      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      setDuration(0);
      setSize(0);
      setGpsCoordinates([]);
      
      // Clear any previous video
      setVideoURL(null);
      
      // Start tracking duration
      durationTimerRef.current = window.setInterval(() => {
        setDuration(prevDuration => prevDuration + 1);
      }, 1000);
      
      // Start GPS tracking
      startGPSTracking();
      
    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        variant: "destructive",
        title: "Recording Failed",
        description: "Could not start recording. Please try again."
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop tracking duration
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
      
      // Stop GPS tracking
      if (gpsTimerRef.current) {
        clearInterval(gpsTimerRef.current);
        gpsTimerRef.current = null;
        setGpsActive(false);
      }
      
      toast({
        title: "Recording Completed",
        description: `Video saved (${formatBytes(size)})`
      });
    }
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

    const MAX_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    
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
      // Simulate upload and processing for now
      // Will be replaced with actual upload logic when connected to backend
      
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setUploadProgress(i);
      }
      
      // Store in localStorage for demo purposes
      // This will be replaced with Supabase storage
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
      
      // Reset for new recording
      setVideoURL(null);
      setGpsCoordinates([]);
      
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
          
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-rail-red-500 text-white px-3 py-1 rounded-full">
              <div className="h-3 w-3 rounded-full bg-white animate-recording"></div>
              <span className="text-sm font-medium">REC</span>
            </div>
          )}
          
          {isRecording && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 text-sm">
              <div className="bg-black/60 text-white px-2 py-1 rounded-md flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(duration)}</span>
              </div>
              
              <div className="bg-black/60 text-white px-2 py-1 rounded-md flex items-center gap-1">
                <Video className="h-3 w-3" />
                <span>{formatBytes(size)}</span>
              </div>
              
              {gpsActive && (
                <div className="bg-black/60 text-white px-2 py-1 rounded-md flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{gpsCoordinates.length > 0 
                    ? `${gpsCoordinates[gpsCoordinates.length-1].latitude.toFixed(5)}, 
                      ${gpsCoordinates[gpsCoordinates.length-1].longitude.toFixed(5)}`
                    : 'Acquiring...'}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between p-4">
          {!isRecording ? (
            <Button 
              onClick={startRecording}
              disabled={!hasPermission || isUploading}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Start Recording
            </Button>
          ) : (
            <Button 
              onClick={stopRecording}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Stop className="h-4 w-4" />
              Stop Recording
            </Button>
          )}
          
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recording Preview</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <video
                  src={videoURL}
                  controls
                  className="w-full h-auto rounded-md"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-medium mb-2">GPS Data ({gpsCoordinates.length} points)</h4>
                <div className="max-h-48 overflow-y-auto text-xs border rounded-md">
                  <table className="min-w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-left">Latitude</th>
                        <th className="px-4 py-2 text-left">Longitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gpsCoordinates.map((coord, index) => (
                        <tr key={index} className="border-t border-border">
                          <td className="px-4 py-2">
                            {new Date(coord.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="px-4 py-2">{coord.latitude.toFixed(5)}</td>
                          <td className="px-4 py-2">{coord.longitude.toFixed(5)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
