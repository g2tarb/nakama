'use client';

import { useEffect, useRef, useState } from 'react';

const REPLAY_DELAY_MS = 5000;

type Phase = 'pending' | 'playing' | 'pausing';

type Props = {
  src: string;
  /** Voile gradient appliqué au-dessus de la vidéo pour préserver la lisibilité du texte. */
  overlay?: string;
  /** Contenu affiché pendant la pause (5 s) entre deux lectures de vidéo. */
  pauseContent?: React.ReactNode;
};

export function BackgroundVideo({
  src,
  overlay = 'linear-gradient(180deg, rgba(30,42,58,0.78) 0%, rgba(30,42,58,0.86) 60%, rgba(30,42,58,0.95) 100%)',
  pauseContent,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [phase, setPhase] = useState<Phase>('pending');
  // re-mounts pauseContent à chaque cycle pour relancer les animations d'entrée
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handleCanPlay = () => setPhase('playing');

    const handleEnded = () => {
      setPhase('pausing');
      setCycleKey((k) => k + 1);
      timeoutId = setTimeout(() => {
        video.currentTime = 0;
        video.play().then(
          () => setPhase('playing'),
          () => setPhase('pending'),
        );
      }, REPLAY_DELAY_MS);
    };

    const handleError = () => setPhase('pending');

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const videoVisible = phase === 'playing';
  const showPause = phase === 'pausing' && pauseContent;

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
      {showPause && (
        <div
          key={cycleKey}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          {pauseContent}
        </div>
      )}
    </>
  );
}
