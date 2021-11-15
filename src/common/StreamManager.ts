export type StreamReadyListener = (stream: MediaStream) => void

export interface StreamEventMap {
  localStreamReady: StreamReadyListener,
  remoteStreamReady: StreamReadyListener
}

class StreamManager {

  private localStream: MediaStream | undefined

  private remoteStream: MediaStream | undefined

  private localStreamReadyListeners : StreamReadyListener[] = []

  private remoteStreamReadyListeners : StreamReadyListener[] = []

  start() {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(stream => {
      this.localStream = stream
      this.localStreamReadyListeners.forEach(listener => listener(stream))
    }).catch(e => {
      console.error('get stream error !!!', e)
    })
  }

  addListener<K extends keyof StreamEventMap>(type: K, listener: StreamEventMap[K]) {
    if (type === 'localStreamReady') {
      this.localStreamReadyListeners.push(listener)
      if (this.localStream) {
        listener(this.localStream)
      }
    } else if (type === 'remoteStreamReady') {
      this.remoteStreamReadyListeners.push(listener)
      if (this.remoteStream) {
        listener(this.remoteStream)
      }
    }
  }


  removeListener<K extends keyof StreamEventMap>(type: K, listener: StreamEventMap[K]) {
    if (type === 'localStreamReady') {
      const targetIndex = this.localStreamReadyListeners.indexOf(listener)
      if (targetIndex > -1) {
        this.localStreamReadyListeners.splice(targetIndex, 1)
      }
    } else if (type === 'remoteStreamReady') {
      const targetIndex = this.remoteStreamReadyListeners.indexOf(listener)
      if (targetIndex > -1) {
        this.remoteStreamReadyListeners.splice(targetIndex, 1)
      }
    }
  }

  getLocalStream() {
    return this.localStream
  }

  setRemoteStream(stream: MediaStream) {
    this.remoteStream = stream
    this.remoteStreamReadyListeners.forEach((listener) => {
      listener(stream)
    })
  }
}

export const streamManager = new StreamManager()
