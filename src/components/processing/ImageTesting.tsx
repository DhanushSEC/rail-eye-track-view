
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, Camera, Eye } from 'lucide-react';
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
  
  // Mock API endpoint - would be replaced with actual endpoint
  const API_ENDPOINT = 'https://api.example.com/detect-cracks';

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
      // In a real implementation, this would be an API call to the backend
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a realistic-looking result based on the image name
      // In production, this would be replaced with actual API call results
      const filename = selectedImage.name.toLowerCase();
      const hasCrackKeyword = filename.includes('crack') || 
                             filename.includes('damage') || 
                             filename.includes('broken');
      
      // Determine result based on keywords or random chance if no keywords
      const detected = hasCrackKeyword || Math.random() < 0.4;
      const confidence = detected ? 50 + Math.random() * 49 : Math.random() * 40;
      
      // Create realistic bounding box for detected cracks
      let bbox = undefined;
      if (detected) {
        const imgWidth = 800;  // Assuming standard width
        const imgHeight = 600; // Assuming standard height
        
        // Generate random but reasonably positioned bounding box
        bbox = {
          x: 100 + Math.floor(Math.random() * 300),
          y: 100 + Math.floor(Math.random() * 200),
          width: 50 + Math.floor(Math.random() * 200),
          height: 20 + Math.floor(Math.random() * 60)
        };
      }
      
      setResult({
        detected,
        confidence,
        bbox
      });
      
      toast({
        title: "Image processed",
        description: detected ? 
          `Crack detected with ${confidence.toFixed(2)}% confidence` : 
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
              {result?.detected && result.bbox && (
                <div
                  className="absolute border-2 border-red-500"
                  style={{
                    left: `${result.bbox.x}px`,
                    top: `${result.bbox.y}px`,
                    width: `${result.bbox.width}px`,
                    height: `${result.bbox.height}px`,
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
