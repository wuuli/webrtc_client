import React, { useEffect, useRef } from 'react';
import { streamManager, StreamReadyListener } from '../../common/StreamManager';
import styles from './index.module.scss'

export const LocalPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleStreamReady: StreamReadyListener = (stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    }
    streamManager.addListener('localStreamReady', handleStreamReady)

    return () => {
      streamManager.removeListener('localStreamReady', handleStreamReady)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div>local preview:</div>
      <video ref={videoRef} autoPlay muted/>
    </div>
  )
}

