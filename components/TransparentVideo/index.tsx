"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface TransparentVideoProps {
  /** Array of base paths without extensions (e.g. ["/video/clip1", "/video/clip2"]) */
  clips: string[];
  className?: string;
  alt?: string;
}

export function TransparentVideo({ clips, className, alt = "" }: TransparentVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);

  useEffect(() => {
    if (clips.length === 0) return;
    const randomIndex = Math.floor(Math.random() * clips.length);
    setSelectedClip(clips[randomIndex]);
  }, [clips]);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // Seek to just before the end and pause to reliably freeze on the last frame
    video.currentTime = Math.max(0, video.duration - 0.01);
    video.pause();
  }, []);

  if (!selectedClip) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      onEnded={handleEnded}
      className={className}
      aria-label={alt}
      role={alt ? "img" : undefined}
    >
      <source src={`${selectedClip}.webm`} type="video/webm" />
      <source src={`${selectedClip}.mov`} type="video/quicktime" />
    </video>
  );
}
