import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Upload,
  AlertCircle,
  Loader2,
  Cog,
  PackageSearch
} from 'lucide-react';
import { ImageTesting } from './ImageTesting';

interface ProcessingStage {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  details?: string;
}

export function ProcessingInfo() {
  const [selectedModel, setSelectedModel] = useState<'roboflow' | 'custom'>('roboflow');
  const [crackDetected, setCrackDetected] = useState<boolean | null>(null);
  const [stages, setStages] = useState<ProcessingStage[]>([
    { name: 'Video Upload', status: 'completed' },
    { name: 'Frame Extraction', status: 'completed' },
    { name: 'GPS Data Processing', status: 'completed' },
    { name: 'Crack Detection', status: 'completed' },
    { name: 'Results Processing', status: 'completed' }
  ]);

  const handleModelChange = (value: string) => {
    setSelectedModel(value as 'roboflow' | 'custom');
  };

  const handleCustomModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      console.log('Custom model uploaded:', event.target.files[0].name);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Processing Information</h1>
        <p className="text-muted-foreground">
          Track detection progress and manage model settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cog className="h-5 w-5" />
              Model Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="select" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="select">Select Model</TabsTrigger>
                <TabsTrigger value="upload">Upload Model</TabsTrigger>
              </TabsList>
              <TabsContent value="select" className="space-y-4">
                <RadioGroup
                  value={selectedModel}
                  onValueChange={handleModelChange}
                  className="grid gap-4 pt-2"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="roboflow" id="roboflow" />
                      <Label htmlFor="roboflow">Roboflow API Model</Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Pre-trained model optimized for rail crack detection
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Custom Model</Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Use your own trained model
                    </p>
                  </div>
                </RadioGroup>
              </TabsContent>
              <TabsContent value="upload" className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="model">Upload Custom Model</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('model-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    <input
                      id="model-upload"
                      type="file"
                      className="hidden"
                      accept=".pth,.onnx,.tflite"
                      onChange={handleCustomModelUpload}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: .pth, .onnx, .tflite
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageSearch className="h-5 w-5" />
              Processing Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stages.map((stage, index) => (
                <div key={stage.name} className="flex items-center gap-4">
                  {index > 0 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground -ml-2" />
                  )}
                  <div className="flex items-center gap-2 flex-1">
                    {stage.status === 'processing' && (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    )}
                    {stage.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {stage.status === 'failed' && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {stage.status === 'pending' && (
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                    )}
                    <span className={stage.status === 'completed' ? 'text-muted-foreground' : ''}>
                      {stage.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Model Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageTesting />
          </CardContent>
        </Card>

        {crackDetected !== null && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Detection Results</CardTitle>
            </CardHeader>
            <CardContent>
              {crackDetected ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Crack Detected</AlertTitle>
                  <AlertDescription>
                    Rail track cracks have been detected in the processed frames.
                    Please check the dashboard for detailed information.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>No Cracks Detected</AlertTitle>
                  <AlertDescription>
                    No rail track cracks were detected in the processed frames.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
