import { io, Socket } from 'socket.io-client';
import { RTCManager } from './RTCManager';

export enum RoomState {
  init = 'init',
  joined = 'joined',
  joined_conn = 'joined_conn'
}

class RoomManager {

  private roomId: number | undefined

  private socket: Socket | undefined

  private state: RoomState = RoomState.init

  private rtcManager: RTCManager | undefined

  private socketConnect() {
    this.socketDisconnect()
    this.socket = io('localhost:3001');

    this.socket.on('joined', (roomId, socketId, userCount) => {
      console.log('receive joined message', roomId, socketId, userCount)
      this.roomId = roomId
      this.state = RoomState.joined

      if (userCount > 1) {
        this.rtcManager = new RTCManager()
      }
    })

    this.socket.on('other_join', (roomId, socketId, userCount) => {
      console.log('receive other_join message', roomId, socketId, userCount)

      if (!this.rtcManager) {
        this.rtcManager = new RTCManager()
      }

      this.rtcManager.createOffer().then(offer => {
        this.sendMessage(offer)
      })
    })

    this.socket.on('full', () => {
      this.socketDisconnect()
      this.rtcManager?.close()
      this.rtcManager = undefined
      alert('房间已满！')
    })

    this.socket.on('left', () => {
      this.state = RoomState.init
      this.socketDisconnect()
    })

    this.socket.on('bye', () => {
      this.state = RoomState.init
      this.rtcManager?.close()
      this.rtcManager = undefined
    })

    this.socket.on('message', (roomId, data) => {
      console.log('received message --->', data)
      const type = data?.type
      switch (type) {
        case 'offer':
          this.rtcManager?.setRemoteOffer(data).then(answer => {
            this.sendMessage(answer)
          })
          break;
        case 'answer':
          this.rtcManager?.setRemoteAnswer(data)
          break;
        case 'icecandidate':
          if (data.candidate) {
            this.rtcManager?.addCandidate(data.candidate)
          } else {
            console.log('this is the end of candidate')
          }
          break
        default:
          console.error('can not handle message', data)
      }
    })
  }

  sendMessage(data: any) {
    console.log('sendMessage', this.roomId, data)
    this.socket?.emit('message', this.roomId, data)
  }

  private socketDisconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = undefined
    }
  }

  join(localRoomId: number) {
    this.socketConnect()
    this.socket?.emit('join', localRoomId)
  }

  left() {
    this.socket?.emit('leave', this.roomId)
    this.rtcManager?.close()
    this.rtcManager = undefined
  }
}

export const roomManager = new RoomManager()
