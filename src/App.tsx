import 'webrtc-adapter'
import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { LocalPreview } from './components/LocalPreview';
import { roomManager, RoomState, RoomStateChangListener } from './common/RoomManager';
import { RemoteVideo } from './components/RemoteVideo';
import './App.scss'
import { StreamChangeListener, streamManager } from './common/StreamManager';

const App: React.FC = () => {

  const [roomId, setRoomId] = useState(0)
  const [localStreamReady, setLocalStreamReady] = useState(false)
  const [roomState, setRoomState] = useState<RoomState>(RoomState.leave)

  const handleInput = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setRoomId(Number(e.target.value) || 0)
  }, [])

  const handleJoin = useCallback(() => {
    roomManager.join(roomId)
  }, [roomId])

  const handleLeft = useCallback(() => {
    roomManager.left()
  }, [])

  useEffect(() => {
    const handleLocalSteamReady: StreamChangeListener = (stream) => {
      setLocalStreamReady(!!stream)
    }

    streamManager.addListener('localStreamChange', handleLocalSteamReady)

    return () => {
      streamManager.removeListener('localStreamChange', handleLocalSteamReady)
    }
  }, [])

  useEffect(() => {
    const handleRoomStateChange: RoomStateChangListener = (state) => {
      setRoomState(state)
    }

    roomManager.addListener('roomStateChange', handleRoomStateChange)

    return () => {
      roomManager.removeListener('roomStateChange', handleRoomStateChange)
    }
  }, [])

  return (
    <div className="App">
      <div className={'video-container'}>
        <LocalPreview />
        <RemoteVideo />
      </div>
      <div>请输入房间号：
        <input value={roomId} onChange={handleInput}/>
      </div>
      <div>
        <button onClick={handleJoin} disabled={!localStreamReady || roomState !== RoomState.leave}>加入房间</button>
        <button onClick={handleLeft} disabled={roomState === RoomState.leave}>离开房间</button>
      </div>
    </div>
  );
}

export default App;
