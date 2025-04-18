
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface GPSCoordinate {
  timestamp: string;
  latitude: number;
  longitude: number;
}

export const useGPSTracking = () => {
  const [gpsCoordinates, setGpsCoordinates] = useState<GPSCoordinate[]>([]);
  const [gpsActive, setGpsActive] = useState(false);
  const gpsTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const logGPSCoordinate = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    const timestamp = new Date().toISOString();
    
    setGpsCoordinates(prev => [
      ...prev,
      { timestamp, latitude, longitude }
    ]);
  };

  const startGPSTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsActive(true);
          logGPSCoordinate(position);
          
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

  const stopGPSTracking = () => {
    if (gpsTimerRef.current) {
      clearInterval(gpsTimerRef.current);
      gpsTimerRef.current = null;
      setGpsActive(false);
    }
  };

  return {
    gpsCoordinates,
    gpsActive,
    startGPSTracking,
    stopGPSTracking
  };
};

