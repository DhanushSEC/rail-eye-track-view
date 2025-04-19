
/**
 * Utility functions for interacting with the Roboflow API
 */

// This would normally be an environment variable
const ROBOFLOW_API_KEY = "YOUR_ROBOFLOW_API_KEY";
const ROBOFLOW_MODEL = "rail-crack-detection/1";

interface RoboflowPrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
}

interface RoboflowResponse {
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: RoboflowPrediction[];
}

/**
 * Detects cracks in an image using the Roboflow API
 */
export const detectCracksInImage = async (imageFile: File): Promise<RoboflowResponse> => {
  try {
    // For demo purposes, we'll simulate the API call
    // In production, use this code instead:
    /*
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await fetch(
      `https://detect.roboflow.com/rail-crack-detection/1?api_key=${ROBOFLOW_API_KEY}`, 
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
    */
    
    // Simulated response for demo purposes
    console.log("Simulating Roboflow API call for image:", imageFile.name);
    
    // Generate a realistic-looking result based on the image name
    // In production, replace this with the actual API call
    const filename = imageFile.name.toLowerCase();
    const hasCrackKeyword = filename.includes('crack') || 
                          filename.includes('damage') || 
                          filename.includes('broken');
    
    // Determine result based on keywords or random chance if no keywords
    const detected = hasCrackKeyword || Math.random() < 0.4;
    
    // Create a simulated response
    const simulatedResponse: RoboflowResponse = {
      time: 0.7623,
      image: {
        width: 800,
        height: 600
      },
      predictions: []
    };
    
    // Add predictions if cracks are detected
    if (detected) {
      const confidence = 50 + Math.random() * 49;
      simulatedResponse.predictions.push({
        x: 100 + Math.floor(Math.random() * 300),
        y: 100 + Math.floor(Math.random() * 200),
        width: 50 + Math.floor(Math.random() * 200),
        height: 20 + Math.floor(Math.random() * 60),
        confidence: confidence / 100, // Roboflow confidence is 0-1
        class: "crack"
      });
      
      // Add second crack with lower probability
      if (Math.random() > 0.7) {
        const confidence2 = 30 + Math.random() * 40;
        simulatedResponse.predictions.push({
          x: 300 + Math.floor(Math.random() * 200),
          y: 200 + Math.floor(Math.random() * 200),
          width: 30 + Math.floor(Math.random() * 150),
          height: 15 + Math.floor(Math.random() * 40),
          confidence: confidence2 / 100,
          class: "crack"
        });
      }
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return simulatedResponse;
  } catch (error) {
    console.error("Error calling Roboflow API:", error);
    throw error;
  }
};

/**
 * Process a video frame with the Roboflow API
 */
export const processVideoFrame = async (frameBlob: Blob): Promise<RoboflowResponse> => {
  try {
    const file = new File([frameBlob], "video-frame.jpg", { type: "image/jpeg" });
    return await detectCracksInImage(file);
  } catch (error) {
    console.error("Error processing video frame:", error);
    throw error;
  }
};

/**
 * Convert a Roboflow prediction to a simplified format
 */
export const convertToSimplePrediction = (prediction: RoboflowPrediction) => {
  return {
    x: prediction.x - prediction.width / 2, // Convert centerX to top-left X
    y: prediction.y - prediction.height / 2, // Convert centerY to top-left Y
    width: prediction.width,
    height: prediction.height,
    confidence: prediction.confidence * 100 // Convert 0-1 to percentage
  };
};
