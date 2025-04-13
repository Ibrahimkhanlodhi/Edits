import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useRef, useState, useEffect } from "react";
import "./VideoEditor.scss";
import DashboardButton from "./DashboardButton";

// Dynamically import FFmpeg to disable server-side rendering
if (typeof window !== "undefined") {
  import("@ffmpeg/ffmpeg").then((module) => {
    const { FFmpeg } = module;
    // You can access FFmpeg here if needed
  });
}

const VideoEditor = () => {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [filter, setFilter] = useState("");
  const [processedVideoURL, setProcessedVideoURL] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoURLRef = useRef<string | null>(null);
  const processedBlobRef = useRef<Blob | null>(null);
  

  // Load FFmpeg core
  useEffect(() => {
    const loadFFmpeg = async () => {
      if (typeof window !== "undefined") {
        setIsLoading(true);
        const ffmpeg = new FFmpeg();

        ffmpeg.on("log", ({ message }) => {
          setStatusMessage(message);
        });

        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        });

        ffmpegRef.current = ffmpeg;
        setLoaded(true);
        setIsLoading(false);
      }
    };

    loadFFmpeg();

    // Cleanup on component unmount
    return () => {
      if (videoURLRef.current) {
        URL.revokeObjectURL(videoURLRef.current);
      }
    };
  }, []);

  // Handle file upload
interface VideoFile extends File {
    // Extends the basic File interface if needed
}

interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & {
        files: FileList | null;
    };
}

const handleFileUpload = (event: FileUploadEvent): void => {
    if (event.target.files && event.target.files[0]) {
        const file: VideoFile = event.target.files[0];
        setVideoFile(file);
        if (videoRef.current) {
            const url: string = URL.createObjectURL(file);
            videoRef.current.src = url;
            if (videoURLRef.current) {
                URL.revokeObjectURL(videoURLRef.current);
            }
            videoURLRef.current = url;
        }
        // Reset states when a new file is uploaded
        setProcessedVideoURL(null);
        processedBlobRef.current = null;
        setSaveSuccess(false);
    }
};

  // Handle file upload click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Transcode video with selected filter
  const transcode = async () => {
    if (!ffmpegRef.current || !videoFile) {
      setStatusMessage("Please upload a video first.");
      return;
    }

    setStatusMessage("Processing video...");
    const ffmpeg = ffmpegRef.current;

    try {
      // Write the uploaded video to FFmpeg
      if (!videoURLRef.current) {
        throw new Error("No video URL available");
      }
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoURLRef.current));

      const args = ["-i", "input.mp4"];
      if (filter) args.push("-vf", filter);
      args.push("-preset", "fast", "output.mp4");

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile("output.mp4");

      // Create a URL for the processed video
      const videoBlob = new Blob([data], { type: "video/mp4" });
      // Store the blob for later use
      processedBlobRef.current = videoBlob;
      const videoURL = URL.createObjectURL(videoBlob);

      // Revoke previous video URL if it exists and is different from the input
      if (videoURLRef.current && videoRef.current && videoURLRef.current !== videoRef.current.src) {
        URL.revokeObjectURL(videoURLRef.current);
      }

      videoURLRef.current = videoURL;
      setProcessedVideoURL(videoURL);

      if (videoRef.current) videoRef.current.src = videoURL;
      setStatusMessage("Video processing complete!");
      // Reset save success state when processing a new video
      setSaveSuccess(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setStatusMessage(`Error processing video: ${errorMessage}`);
      console.error("Error processing video:", error);
    }
  };

  // Download the processed video
  const downloadVideo = () => {
    if (processedVideoURL) {
      const a = document.createElement("a");
      a.href = processedVideoURL;
      a.download = "processed_video.mp4";
      a.click();
    }
  };
  
  // Save the processed video to Cloudinary and MongoDB
  
// Save the processed video to Cloudinary and MongoDB
const saveToCloudinary = async () => {
  if (!processedBlobRef.current) {
    setStatusMessage("No processed video to save. Please process a video first.");
    return;
  }

  setIsSaving(true);
  setStatusMessage("Saving video to your account...");

  try {
    // Create FormData to send the file
    const formData = new FormData();
    
    // Add the video file with the correct name and type
    const file = new File(
      [processedBlobRef.current], 
      "processed_video.mp4", 
      { type: "video/mp4" }
    );
    formData.append("file", file);
    
    // Add video title - you could make this customizable in the UI
    const videoTitle = `${filter ? filter.split('=')[0] : 'Processed'} Video - ${Date.now()}`;
    formData.append("title", videoTitle);
    
    // Send to our API endpoint
    const response = await fetch("/api/upload-to-cloudinary", {
      method: "POST", 
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to upload: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Update UI to show success
    setSaveSuccess(true);
    setStatusMessage(`Video "${result.video.title}" saved successfully! You can view it in your dashboard.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    setStatusMessage(`Error saving video: ${errorMessage}`);
    console.error("Error saving to Cloudinary:", error);
  } finally {
    setIsSaving(false);
  }
};

  // Loading State Component
  if (!loaded) {
    return (
      <div className={"video-editor"}>
        <div className={"loading-container"}>
          <button 
            className={"btn btn--primary"}
            onClick={() => setIsLoading(true)}
            disabled={isLoading}
          >
            Load FFmpeg Core
            {isLoading && (
              <span className={"spinner"}>
                <svg
                  viewBox="0 0 1024 1024"
                  focusable="false"
                  data-icon="loading"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
                </svg>
              </span>
            )}
          </button>
          {isLoading && <p>Loading FFmpeg core modules...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={"video-editor"}>
      <h1>Video Editor</h1>

      {/* File Upload Area */}
      <div className={"file-upload"}>
        <div className={"file-upload__container"} onClick={handleUploadClick}>
          <input 
            type="file" 
            ref={fileInputRef}
            accept="video/*" 
            onChange={handleFileUpload} 
          />
          <label>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>{videoFile ? videoFile.name : "Click to upload video"}</span>
          </label>
        </div>
      </div>

      {/* Video Preview */}
      <div className={"video-preview"}>
        <video ref={videoRef} controls></video>
      </div>

      {/* Filter Controls */}
      <div className={"filter-controls"}>
        <h2 className={"filter-controls__header"}>Apply Filter</h2>
        <div className={"filter-controls__select-container"}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">No Filter</option>
            <option value="hue=s=0">Grayscale</option>
            <option value="colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131">Sepia</option>
            <option value="eq=contrast=1.5:brightness=0.05">High Contrast</option>
            <option value="hue=h=90">Hue Shift</option>
            <option value="negate">Invert Colors</option>
            <option value="vflip">Vertical Flip</option>
            <option value="hflip">Horizontal Flip</option>
            <option value="noise=alls=20:allf=t+u">Noise</option>
            <option value="drawtext=text='FFmpeg is Awesome':x=10:y=10:fontcolor=white">Text Overlay</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={"action-buttons"}>
        <button
          onClick={transcode}
          className={"btn btn--secondary btn--full"}
          disabled={!videoFile}
        >
          Apply Filter & Process
        </button>

        {processedVideoURL && (
          <>
            <button
              onClick={downloadVideo}
              className={"btn btn--primary btn--full"}
            >
              Download Processed Video
            </button>
            
            <button
              onClick={saveToCloudinary}
              className={"btn btn--success btn--full"}
              disabled={isSaving || saveSuccess}
            >
              {isSaving ? (
                <>
                  Saving...
                  <span className={"spinner spinner--inline"}>
                    <svg
                      viewBox="0 0 1024 1024"
                      focusable="false"
                      data-icon="loading"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
                    </svg>
                  </span>
                </>
              ) : saveSuccess ? (
                "Saved ✓"
              ) : (
                "Save to My Account"
              )}
            </button>
          </>
        )}

        
      </div>
      

      {/* Status Message */}
      <div className={"status-message"}>
        {statusMessage}
      </div>
<div className="action-buttons">
  
  <button className="btn btn--secondary btn--full" >
        <DashboardButton/>
      </button>
</div>
      
    </div>
  );
};

export default VideoEditor;