
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface Recording {
  id: string;
  userId: string;
  videoUrl: string;
  timestamp: string;
  size: number;
  duration: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

export function ProcessingQueue() {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    // Load recordings from localStorage
    const loadRecordings = () => {
      const storedRecordings = JSON.parse(localStorage.getItem("railAppRecordings") || '[]');
      setRecordings(storedRecordings);
    };

    loadRecordings();
    
    // Set up interval to simulate processing progress
    const processingInterval = setInterval(() => {
      // Simulate processing progression
      const updatedRecordings = JSON.parse(localStorage.getItem("railAppRecordings") || '[]');
      
      let hasChanges = false;
      const processed = updatedRecordings.map((recording: Recording) => {
        // Simulate status progression: queued -> processing -> completed
        if (recording.status === 'queued' && Math.random() > 0.7) {
          hasChanges = true;
          return { ...recording, status: 'processing' };
        } else if (recording.status === 'processing' && Math.random() > 0.7) {
          hasChanges = true;
          return { ...recording, status: 'completed' };
        }
        return recording;
      });
      
      if (hasChanges) {
        localStorage.setItem("railAppRecordings", JSON.stringify(processed));
        setRecordings(processed);
      }
    }, 3000);
    
    return () => clearInterval(processingInterval);
  }, []);

  if (recordings.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Processing Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div key={recording.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {recording.status === 'queued' && (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                  {recording.status === 'processing' && (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                  {recording.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span>
                    Recording from {new Date(recording.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Duration: {formatDuration(recording.duration)}
                </div>
              </div>
              <Badge
                variant={
                  recording.status === 'completed' 
                    ? 'default'
                    : recording.status === 'processing' 
                      ? 'secondary' 
                      : 'outline'
                }
              >
                {recording.status === 'queued' && 'Queued'}
                {recording.status === 'processing' && 'Processing'}
                {recording.status === 'completed' && 'Completed'}
                {recording.status === 'failed' && 'Failed'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
