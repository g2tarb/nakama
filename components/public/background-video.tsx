'use client';

import { useEffect, useRef, useState } from 'react';

const REPLAY_DELAY_MS = 5000;

export type VideoPhase = 'pending' | 'playing' | 'pausing';

type Props = {
  src: string;
  /** Voile gradient appliqué au-dessus de la vidéo pour préserver la lisibilité du texte. */
  overlay?: string;
  /** Callback notifié à chaque changement de phase. */
  onPhaseChange?: (phase: VideoPhase, cycleKey: number) => void;
};

export function BackgroundVideo({
  src,
  overlay = 'linear-gradient(180deg, rgba(30,42,58,0.78) 0%, rgba(30,42,58,0.86) 60%, rgba(30,42,58,0.95) 100%)',
  onPhaseChange,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [phase, setPhase] = useState<VideoPhase>('pending');
  const cycleKeyRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const updatePhase = (next: VideoPhase) => {
      setPhase(next);
      onPhaseChange?.(next, cycleKeyRef.current);
    };

    const handleCanPlay = () => updatePhase('playing');

    const handleEnded = () => {
      cycleKeyRef.current += 1;
      updatePhase('pausing');
      timeoutId = setTimeout(() => {
        video.currentTime = 0;
        video.play().then(
          () => updatePhase('playing'),
          () => updatePhase('pending'),
        );
      }, REPLAY_DELAY_MS);
    };

    const handleError = () => updatePhase('pending');

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onPhaseChange]);

  const videoVisible = phase === 'playing';

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: videoVisible ? 1 : 0 }}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 transition-opacity duration-500"
        aria-hidden="true"
        style={{ opacity: videoVisible ? 1 : 0, background: overlay }}
      />
    </>
  );
}
