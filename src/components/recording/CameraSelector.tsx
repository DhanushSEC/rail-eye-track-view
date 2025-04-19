
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

interface CameraSelectorProps {
  cameras: MediaDeviceInfo[];
  selectedCamera: string | null;
  onCameraChange: (deviceId: string) => void;
  disabled?: boolean;
}

export const CameraSelector = ({ 
  cameras, 
  selectedCamera, 
  onCameraChange,
  disabled 
}: CameraSelectorProps) => {
  if (cameras.length <= 1) {
    return null; // Don't show selector if only one camera is available
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="camera-select" className="flex items-center gap-2">
        <Camera className="h-4 w-4" />
        Select Camera
      </Label>
      <Select
        value={selectedCamera || undefined}
        onValueChange={onCameraChange}
        disabled={disabled}
      >
        <SelectTrigger id="camera-select" className="w-full">
          <SelectValue placeholder="Select camera" />
        </SelectTrigger>
        <SelectContent>
          {cameras.map((camera) => (
            <SelectItem key={camera.deviceId} value={camera.deviceId}>
              {camera.label || `Camera ${camera.deviceId.slice(0, 5)}...`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
