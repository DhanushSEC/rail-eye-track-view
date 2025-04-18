
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface GPSCoordinate {
  timestamp: string;
  latitude: number;
  longitude: number;
}

interface VideoPreviewProps {
  videoURL: string;
  gpsCoordinates: GPSCoordinate[];
}

export const VideoPreview = ({ videoURL, gpsCoordinates }: VideoPreviewProps) => {
  return (
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
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0">
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gpsCoordinates.map((coord, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(coord.timestamp).toLocaleTimeString()}</TableCell>
                      <TableCell>{coord.latitude.toFixed(5)}</TableCell>
                      <TableCell>{coord.longitude.toFixed(5)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

