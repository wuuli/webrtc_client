import 'webrtc-adapter'
import React, { ChangeEventHandler, useCallback, useState } from 'react';
import { LocalPreview } from './components/LocalPreview';
import { roomManager } from './common/RoomManager';
import { RemoteVideo } from './components/RemoteVideo';
import './App.scss'

const App: React.FC = () => {

  const [roomId, setRoomId] = useState(0)

  const handleInput = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setRoomId(Number(e.target.value) || 0)
  }, [])

  const handleJoin = useCallback(() => {
    roomManager.join(roomId)
  }, [roomId])

  const handleLeft = useCallback(() => {
    roomManager.left()
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
        <button onClick={handleJoin}>加入房间</button>
        <button onClick={handleLeft}>离开房间</button>
      </div>
    </div>
  );
}

export default App;
