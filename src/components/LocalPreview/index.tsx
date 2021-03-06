import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { StreamChangeListener, streamManager } from '../../common/StreamManager';
import styles from './index.module.scss'
import classNames from 'classnames';

export interface LocalPreviewProps {
  className?: string
}

export const LocalPreview: React.FC<LocalPreviewProps> = ({className}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])

  const [videoSelected, setVideoSelected] = useState('')
  const [audioSelected, setAudioSelected] = useState('')

  const handleDeviceChange = useCallback(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      setVideoDevices(devices.filter(d => d.kind === 'videoinput'))
      setAudioDevices(devices.filter(d => d.kind === 'audioinput'))
    })
  }, [])

  useEffect(() => {
    streamManager.requestPermission().then(() => {
      handleDeviceChange()
    }).catch(e => {
      console.error('request permission error !!!', e)
    })

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange)
    }
  }, [handleDeviceChange])

  useEffect(() => {
    const handleStreamChange: StreamChangeListener = (stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    }
    streamManager.addListener('localStreamChange', handleStreamChange)

    return () => {
      streamManager.removeListener('localStreamChange', handleStreamChange)
    }
  }, [])

  useEffect(() => {
    if (videoSelected && audioSelected) {
      streamManager.start(videoSelected, audioSelected)
    }
  }, [videoSelected, audioSelected])

  const handleVideoSelect = useCallback((e: ChangeEvent<HTMLInputElement>, deviceId: string) => {
    if (e.target.checked) {
      setVideoSelected(deviceId)
    }
  }, [])

  const handleAudioSelect = useCallback((e: ChangeEvent<HTMLInputElement>, deviceId: string) => {
    if (e.target.checked) {
      setAudioSelected(deviceId)
    }
  }, [])

  return (
    <div className={classNames(styles.container, className)}>
      <div>????????????????????????</div>
      {videoDevices.map(device => (
        <div key={device.deviceId}>
          <input
            id={device.deviceId}
            type={'radio'}
            checked={videoSelected === device.deviceId}
            onChange={(e) => {
              handleVideoSelect(e, device.deviceId)}
            }/>
          <label>{device.label}</label>
        </div>
      ))}
      <div>????????????????????????</div>
      {audioDevices.map(device => (
        <div key={device.deviceId}>
          <input
            id={device.deviceId}
            type={'radio'}
            checked={audioSelected === device.deviceId}
            onChange={(e) => {
              handleAudioSelect(e, device.deviceId)}
            }/>
          <label>{device.label}</label>
        </div>
      ))}
      <div>local preview:</div>
      <video ref={videoRef} autoPlay muted/>
    </div>
  )
}

