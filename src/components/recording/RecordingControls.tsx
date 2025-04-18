
import { Button } from '@/components/ui/button';
import { Camera, Video, Square, MapPin, Clock } from 'lucide-react';
import { formatBytes, formatDuration } from '@/lib/utils';

interface RecordingControlsProps {
  isRecording: boolean;
  duration: number;
  size: number;
  gpsActive: boolean;
  gpsCoordinates: Array<{ latitude: number; longitude: number; timestamp: string }>;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
}

export const RecordingControls = ({
  isRecording,
  duration,
  size,
  gpsActive,
  gpsCoordinates,
  onStartRecording,
  onStopRecording,
  disabled
}: RecordingControlsProps) => {
  return (
    <div className="relative">
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
          
          {gpsActive && gpsCoordinates.length > 0 && (
            <div className="bg-black/60 text-white px-2 py-1 rounded-md flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>
                {gpsCoordinates[gpsCoordinates.length-1].latitude.toFixed(5)}, 
                {gpsCoordinates[gpsCoordinates.length-1].longitude.toFixed(5)}
              </span>
            </div>
          )}
        </div>
      )}
      
      {!isRecording ? (
        <Button 
          onClick={onStartRecording}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Start Recording
        </Button>
      ) : (
        <Button 
          onClick={onStopRecording}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <Square className="h-4 w-4" />
          Stop Recording
        </Button>
      )}
    </div>
  );
};

