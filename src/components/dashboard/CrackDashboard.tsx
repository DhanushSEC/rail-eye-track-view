
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Eye, Map, Calendar as CalendarIcon, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// Sample crack data for demo purposes
interface CrackData {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}

export function CrackDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [selectedCrack, setSelectedCrack] = useState<CrackData | null>(null);
  const navigate = useNavigate();
  
  // Sample data for demonstration
  const cracks: CrackData[] = [
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
      timestamp: '2025-04-18T14:30:00Z',
      latitude: 40.7138,
      longitude: -74.0050
    },
    {
      id: '3',
      userId: 'temp-user-id',
      imageUrl: 'https://images.unsplash.com/photo-1635443034386-849d2261ac65?q=80&w=1000&auto=format&fit=crop',
      timestamp: '2025-04-18T15:45:00Z',
      latitude: 40.7148,
      longitude: -74.0040
    }
  ];

  // Filter cracks based on search and date range
  const filteredCracks = cracks.filter((crack) => {
    const matchesSearch = 
      searchTerm === '' || 
      crack.id.includes(searchTerm) || 
      `${crack.latitude}, ${crack.longitude}`.includes(searchTerm);
    
    const crackDate = new Date(crack.timestamp);
    const matchesDateRange = 
      (!fromDate || crackDate >= fromDate) && 
      (!toDate || crackDate <= toDate);
    
    return matchesSearch && matchesDateRange;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Track Crack Dashboard</h2>
        <Button onClick={() => navigate('/map')}>
          <Map className="mr-2 h-4 w-4" /> View Map
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detection Filter</CardTitle>
          <CardDescription>Filter crack detections by location and date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by location or ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, 'PP') : 'From Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, 'PP') : 'To Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {(fromDate || toDate || searchTerm) && (
                <Button variant="ghost" onClick={() => {
                  setSearchTerm('');
                  setFromDate(undefined);
                  setToDate(undefined);
                }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCracks.map((crack) => (
          <Card key={crack.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={crack.imageUrl} 
                alt="Rail Crack" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-rail-red-500">Crack Detected</Badge>
              </div>
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Detection #{crack.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(crack.timestamp).toLocaleString()}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedCrack(crack)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <div className="space-y-4">
                      <img 
                        src={crack.imageUrl} 
                        alt="Rail Crack" 
                        className="w-full h-auto rounded-md"
                      />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Date & Time</div>
                          <div>{new Date(crack.timestamp).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium">Location</div>
                          <div>
                            {crack.latitude.toFixed(5)}, {crack.longitude.toFixed(5)}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full" onClick={() => navigate('/map')}>
                        <Map className="mr-2 h-4 w-4" /> View on Map
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="text-xs text-muted-foreground">
                GPS: {crack.latitude.toFixed(5)}, {crack.longitude.toFixed(5)}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredCracks.length === 0 && (
          <Card className="col-span-full p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-muted/50 p-4 rounded-full">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium">No cracks found</h3>
              <p className="text-sm text-muted-foreground">
                Try changing your search criteria or date range.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
