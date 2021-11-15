import React, { useEffect, useRef } from 'react';
import { StreamChangeListener, streamManager } from '../../common/StreamManager';
import styles from './index.module.scss'
import classNames from 'classnames';

export interface RemoteVideoProps {
  className?: string
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({className}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleStreamChange: StreamChangeListener = (stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    }

    streamManager.addListener('remoteStreamChange', handleStreamChange)

    return () => {
      streamManager.removeListener('remoteStreamChange', handleStreamChange)
    }
  }, [])

  return (
    <div className={classNames(styles.container, className)}>
      <div>remote video:</div>
      <video ref={videoRef} autoPlay/>
    </div>
  )
}
