import { streamManager } from './StreamManager';

export class RTCManager {
  private connection: RTCPeerConnection

  constructor() {
    this.connection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'turn:xulin.fun:3478',
          username: 'aaaaaa',
          credential: 'bbbbbb'
        }
      ],
      iceTransportPolicy: 'relay',
      iceCandidatePoolSize: 0
    })

    this.connection.addEventListener('icecandidate', (e) => {
      console.log('icecandidate', e)
    })

    this.connection.addEventListener('track', (e) => {
      console.log(e)
    })

    streamManager.getLocalStream()?.getTracks().forEach((track) => {
      console.log('add local track --->', track.label)
      this.connection.addTrack(track)
    })
  }

  async createOffer() {
    const offer = await this.connection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    console.log('createOffer --->', offer)

    this.connection.setLocalDescription(offer).then(() => {
      console.log('LocalDescription is set')
    })

    return offer
  }
}
