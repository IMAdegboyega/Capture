"use client";

import { cn, createIframeLink } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import {
  incrementVideoViews,
  getVideoProcessingStatus,
} from "@/lib/api/videos";
import { initialVideoState } from "@/constants";
import toast from "react-hot-toast";

const VideoPlayer = ({ videoId, className }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState(initialVideoState);

  useEffect(() => {
    const checkProcessingStatus = async () => {
      const status = await getVideoProcessingStatus(videoId);
      setState((prev) => ({
        ...prev,
        isProcessing: !status.is_processed,
      }));

      return status.is_processed;
    };

    checkProcessingStatus();

    const intervalId = setInterval(async () => {
      const isProcessed = await checkProcessingStatus();
      if (isProcessed) {
        clearInterval(intervalId);
      }
    }, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [videoId]);

  useEffect(() => {
    if (state.isLoaded && !state.hasIncrementedView && !state.isProcessing) {
      const incrementView = async () => {
        try {
          await incrementVideoViews(videoId);
          setState((prev) => ({ ...prev, hasIncrementedView: true }));
        } catch (error) {
          console.error("Failed to increment view count:", error);
          toast.error("Failed to record view");
        }
      };

      incrementView();
    }
  }, [videoId, state.isLoaded, state.hasIncrementedView, state.isProcessing]);

  return (
    <div className={cn("video-player", className)}>
      {state.isProcessing ? (
        <div className="processing-state">
          <div className="processing-spinner" />
          <h3>Processing your video</h3>
          <p>This usually takes a few moments. The page will update automatically.</p>
          <div className="processing-bar">
            <div className="processing-bar-fill" />
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={createIframeLink(videoId)}
          loading="lazy"
          title="Video player"
          style={{ border: 0, zIndex: 50 }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={() => setState((prev) => ({ ...prev, isLoaded: true }))}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
