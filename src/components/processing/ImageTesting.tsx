
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, Camera, Eye } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { detectCracksInImage, convertToSimplePrediction } from '@/lib/roboflowApi';

export function ImageTesting() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    detected: boolean;
    confidence?: number;
    predictions?: { x: number; y: number; width: number; height: number; confidence: number }[];
  } | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive"
        });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const roboflowResponse = await detectCracksInImage(selectedImage);
      
      // Process the response
      const detected = roboflowResponse.predictions.length > 0;
      const highestConfidencePrediction = roboflowResponse.predictions.reduce(
        (highest, current) => current.confidence > highest.confidence ? current : highest,
        { confidence: 0 } as any
      );
      
      // Convert predictions to simpler format with normalized coordinates
      const predictions = roboflowResponse.predictions.map(convertToSimplePrediction);
      
      setResult({
        detected,
        confidence: detected ? highestConfidencePrediction.confidence * 100 : undefined,
        predictions
      });
      
      toast({
        title: "Image processed",
        description: detected ? 
          `Crack detected with ${(highestConfidencePrediction.confidence * 100).toFixed(2)}% confidence` : 
          "No cracks detected in this image",
      });
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Processing failed",
        description: "An error occurred while processing the image",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Test Crack Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload Test Image</Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground">
            Upload an image to test the crack detection model
          </p>
        </div>

        {imagePreview && (
          <div className="relative max-w-md mx-auto">
            <div className="relative border rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto"
              />
              {result?.detected && result.predictions && result.predictions.map((prediction, index) => (
                <div
                  key={index}
                  className="absolute border-2 border-red-500"
                  style={{
                    left: `${prediction.x}px`,
                    top: `${prediction.y}px`,
                    width: `${prediction.width}px`,
                    height: `${prediction.height}px`,
                  }}
                >
                  <span className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 rounded">
                    {prediction.confidence.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={processImage}
          disabled={!selectedImage || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Analyze Image
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.detected ? "destructive" : "default"}>
            <AlertTitle>
              {result.detected ? "Crack Detected" : "No Crack Detected"}
            </AlertTitle>
            <AlertDescription>
              {result.detected
                ? `Crack detected with ${result.confidence?.toFixed(2)}% confidence`
                : "No cracks were detected in this image"}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
