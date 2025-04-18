
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [size, setSize] = useState(0);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const mediaStream = videoRef.current?.srcObject as MediaStream;
      
      if (!mediaStream) {
        throw new Error('No media stream available');
      }
      
      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          setSize(prevSize => prevSize + event.data.size);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
      };
      
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setDuration(0);
      setSize(0);
      setVideoURL(null);
      
      durationTimerRef.current = window.setInterval(() => {
        setDuration(prevDuration => prevDuration + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        variant: "destructive",
        title: "Recording Failed",
        description: "Could not start recording. Please try again."
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
      
      toast({
        title: "Recording Completed",
        description: `Video saved (${formatBytes(size)})`
      });
    }
  };

  return {
    isRecording,
    duration,
    size,
    videoURL,
    videoRef,
    startRecording,
    stopRecording
  };
};

