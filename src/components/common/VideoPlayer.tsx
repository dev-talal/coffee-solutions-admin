import VideoJS from '@/lib/VideoJs';
import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  src: string;
  type?: string;
}

export const VideoPlayer = ({ src, type = 'video/mp4' }: VideoPlayerProps) => {
  const playerRef = React.useRef<ReturnType<typeof videojs> | null>(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: src,
        type: type,
      },
    ],
  };

  const handlePlayerReady = (player: ReturnType<typeof videojs>) => {
    if (playerRef.current) {
      playerRef.current = player;
    }

    // player.on('waiting', () => {
    //   videojs.log('player is waiting');
    // });

    // player.on('dispose', () => {
    //   videojs.log('player will dispose');
    // });
  };

  return (
    <>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </>
  );
};
