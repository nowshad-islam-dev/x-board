import { io } from 'socket.io-client';

// components
import WhiteBoard from './components/WhiteBoard';

const socket = io('http://localhost:3001');

const App = () => {
  return (
    <div className="App">
      <WhiteBoard socket={socket} />
    </div>
  );
};

export default App;
