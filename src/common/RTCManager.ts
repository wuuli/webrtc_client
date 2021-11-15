import { streamManager } from './StreamManager';
import { roomManager } from './RoomManager';

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
      console.log('icecandidate', e.candidate)
      roomManager.sendMessage({
        type: 'icecandidate',
        candidate: e.candidate?.toJSON()
      })
    })

    this.connection.addEventListener('track', (e) => {
      console.log('track', e)
      streamManager.addTrackToRemoteStream(e.track)
    })


    this.connection.addEventListener('iceconnectionstatechange', (e) => {
      console.log('iceconnectionstatechange -->', this.connection.iceConnectionState)
    })

    this.connection.addEventListener('icegatheringstatechange', () => {
      console.log('icegatheringstatechange --->', this.connection.iceGatheringState)
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

  async setRemoteOffer(offer: RTCSessionDescriptionInit) {
    this.connection.setRemoteDescription(offer).then(() => {
      console.log('RemoteDescription is set')
    })
    const answer = await this.connection.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })

    this.connection.setLocalDescription(answer).then(() => {
      console.log('LocalDescription is set')
    })

    return answer
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit) {
    await this.connection.setRemoteDescription(answer)
    console.log('RemoteDescription is set')
  }

  async addCandidate(candidate: RTCIceCandidate) {
    await this.connection.addIceCandidate(candidate)

    console.log(`IceCandidate added`)
  }

  close() {
    streamManager.resetRemoteStream()
    this.connection.close()
  }
}
