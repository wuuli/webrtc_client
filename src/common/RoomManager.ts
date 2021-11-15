import { io, Socket } from 'socket.io-client';
import { streamManager } from './StreamManager';
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

    this.socket.on('joined', (roomId, id) => {
      console.log('receive joined message', roomId, id)
      this.roomId = roomId
      this.state = RoomState.joined

      this.rtcManager = new RTCManager()
    })

    this.socket.on('other_join', (roomId, id) => {
      console.log('receive other_join message', roomId, id)

      this.rtcManager?.createOffer().then(offer => {
        this.sendMessage(offer)
      })
    })
  }

  private sendMessage(data: any) {
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
    this.socketDisconnect()
  }
}

export const roomManager = new RoomManager()
