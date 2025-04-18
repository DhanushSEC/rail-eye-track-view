
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Sample crack data for demo purposes
interface CrackData {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}

export function CrackMap() {
  const [map, setMap] = useState<any>(null);
  const [selectedCrack, setSelectedCrack] = useState<CrackData | null>(null);
  const [cracks, setCracks] = useState<CrackData[]>([]);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load demo data from localStorage for now
    // This will be replaced with actual data from Supabase
    const loadDemoData = () => {
      const demoData: CrackData[] = [
        {
          id: '1',
          userId: 'temp-user-id',
          imageUrl: 'https://images.unsplash.com/photo-1635443034386-849d2261ac65?q=80&w=1000&auto=format&fit=crop',
          timestamp: '2025-04-18T13:00:01Z',
          latitude: 40.7128,
          longitude: -74.0060
        },
        {
          id: '2',
          userId: 'temp-user-id',
          imageUrl: 'https://images.unsplash.com/photo-1635443034386-849d2261ac65?q=80&w=1000&auto=format&fit=crop',
          timestamp: '2025-04-18T13:01:30Z',
          latitude: 40.7138,
          longitude: -74.0050
        },
        {
          id: '3',
          userId: 'temp-user-id',
          imageUrl: 'https://images.unsplash.com/photo-1635443034386-849d2261ac65?q=80&w=1000&auto=format&fit=crop',
          timestamp: '2025-04-18T13:02:45Z',
          latitude: 40.7148,
          longitude: -74.0040
        }
      ];
      
      setCracks(demoData);
    };
    
    loadDemoData();
  }, []);

  // Initialize the map when the component mounts
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Import Leaflet dynamically to avoid SSR issues
    const loadMap = async () => {
      try {
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        
        // Check if map is already initialized
        if (!map) {
          const newMap = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(newMap);
          
          setMap(newMap);
        }
      } catch (err) {
        console.error('Error loading map:', err);
      }
    };
    
    loadMap();
    
    // Cleanup on unmount
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  // Add markers when map and cracks are available
  useEffect(() => {
    if (map && cracks.length > 0) {
      const loadMarkers = async () => {
        const L = await import('leaflet');
        
        // Clear existing markers
        map.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });
        
        // Add new markers
        const markers = cracks.map(crack => {
          const marker = L.marker([crack.latitude, crack.longitude])
            .addTo(map)
            .bindPopup(`
              <strong>Crack Detected</strong><br>
              ${new Date(crack.timestamp).toLocaleString()}<br>
              <button class="crack-popup-btn">View Details</button>
            `);
            
          marker.on('popupopen', () => {
            document.querySelector('.crack-popup-btn')?.addEventListener('click', () => {
              setSelectedCrack(crack);
            });
          });
          
          return marker;
        });
        
        // Fit map bounds to show all markers
        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds());
        }
      };
      
      loadMarkers();
    }
  }, [map, cracks]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map) return;
    const currentZoom = map.getZoom();
    direction === 'in' ? map.setZoom(currentZoom + 1) : map.setZoom(currentZoom - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Track Crack Map</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {cracks.length} Cracks Detected
          </Badge>
        </div>
      </div>
      
      <Card className="border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Railway Track Inspection Map</CardTitle>
          <CardDescription>Interactive map of detected track cracks</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-[600px] w-full">
            <div ref={mapContainerRef} className="absolute inset-0" />
            
            <div className="absolute right-4 top-4 flex flex-col gap-2 z-[1000]">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleZoom('in')}
                className="shadow-md"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleZoom('out')}
                className="shadow-md"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="shadow-md"
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCrack} onOpenChange={(open) => !open && setSelectedCrack(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crack Detection Details</DialogTitle>
          </DialogHeader>
          
          {selectedCrack && (
            <div className="space-y-4">
              <img 
                src={selectedCrack.imageUrl} 
                alt="Rail Crack" 
                className="w-full h-auto rounded-md"
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Date & Time</div>
                  <div>{new Date(selectedCrack.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-medium">Location</div>
                  <div>
                    {selectedCrack.latitude.toFixed(5)}, {selectedCrack.longitude.toFixed(5)}
                  </div>
                </div>
              </div>
              
              <Button variant="secondary" className="w-full">
                View in Dashboard
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
