export type StreamChangeListener = (stream: MediaStream | null) => void

export interface StreamEventMap {
  localStreamChange: StreamChangeListener,
  remoteStreamChange: StreamChangeListener
}

class StreamManager {

  private localStream: MediaStream | undefined

  private remoteStream: MediaStream | null = null

  private localStreamChangeListeners : StreamChangeListener[] = []

  private remoteStreamChangeListeners : StreamChangeListener[] = []

  async requestPermission() {
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
  }

  start(videoDid: string, audioDid: string) {
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: {
          exact: videoDid
        },
      },
      audio: {
        deviceId: {
          exact: audioDid
        },
      },
    }).then(stream => {
      this.localStream = stream
      this.localStreamChangeListeners.forEach(listener => listener(stream))
    }).catch(e => {
      console.error('get stream error !!!', e)
    })
  }

  addListener<K extends keyof StreamEventMap>(type: K, listener: StreamEventMap[K]) {
    if (type === 'localStreamChange') {
      this.localStreamChangeListeners.push(listener)
      if (this.localStream) {
        listener(this.localStream)
      }
    } else if (type === 'remoteStreamChange') {
      this.remoteStreamChangeListeners.push(listener)
      if (this.remoteStream) {
        listener(this.remoteStream)
      }
    }
  }


  removeListener<K extends keyof StreamEventMap>(type: K, listener: StreamEventMap[K]) {
    if (type === 'localStreamChange') {
      const targetIndex = this.localStreamChangeListeners.indexOf(listener)
      if (targetIndex > -1) {
        this.localStreamChangeListeners.splice(targetIndex, 1)
      }
    } else if (type === 'remoteStreamChange') {
      const targetIndex = this.remoteStreamChangeListeners.indexOf(listener)
      if (targetIndex > -1) {
        this.remoteStreamChangeListeners.splice(targetIndex, 1)
      }
    }
  }

  getLocalStream() {
    return this.localStream
  }

  resetRemoteStream() {
    this.remoteStream = null
    this.remoteStreamChangeListeners.forEach(listener => {
      listener(this.remoteStream)
    })
  }

  addTrackToRemoteStream(track: MediaStreamTrack) {
    if (this.remoteStream) {
      this.remoteStream.addTrack(track)
    } else {
      this.remoteStream = new MediaStream([track])
    }
    this.remoteStreamChangeListeners.forEach(listener => {
      listener(this.remoteStream)
    })
  }
}

export const streamManager = new StreamManager()
