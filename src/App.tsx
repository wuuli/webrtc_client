import 'webrtc-adapter'
import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { streamManager } from './common/StreamManager';
import { LocalPreview } from './components/LocalPreview';
import { roomManager } from './common/RoomManager';

const App: React.FC = () => {

  const [roomId, setRoomId] = useState(0)

  useEffect(() => {
    streamManager.start()
  }, [])

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
      <LocalPreview />
      <div>请输入房间号：
        <input value={roomId} onChange={handleInput}/>
        <button onClick={handleJoin}>加入房间</button>
      </div>
      <div>
        <button onClick={handleLeft}>加入房间</button>
      </div>
    </div>
  );
}

export default App;
