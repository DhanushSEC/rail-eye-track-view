
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export function ImageTesting() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    detected: boolean;
    confidence?: number;
    bbox?: { x: number; y: number; width: number; height: number };
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
      // Simulated API call - replace with actual model inference
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated result - replace with actual model response
      const mockResult = {
        detected: Math.random() > 0.5,
        confidence: Math.random() * 100,
        bbox: {
          x: 100,
          y: 100,
          width: 200,
          height: 100
        }
      };
      
      setResult(mockResult);
      toast({
        title: "Image processed",
        description: "Analysis complete",
      });
    } catch (error) {
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
        <CardTitle>Test Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload Image</Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
        </div>

        {imagePreview && (
          <div className="relative max-w-md mx-auto">
            <div className="relative border rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto"
              />
              {result?.detected && result.bbox && (
                <div
                  className="absolute border-2 border-red-500"
                  style={{
                    left: `${(result.bbox.x / 800) * 100}%`,
                    top: `${(result.bbox.y / 600) * 100}%`,
                    width: `${(result.bbox.width / 800) * 100}%`,
                    height: `${(result.bbox.height / 600) * 100}%`
                  }}
                />
              )}
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
              <Upload className="mr-2 h-4 w-4" />
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
