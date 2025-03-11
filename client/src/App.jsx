import { useState } from 'react';
import { io } from 'socket.io-client';

// components
import WhiteBoard from './components/WhiteBoard';
import Toolbar from './components/Toolbar';

const socket = io('http://localhost:3001');

const App = () => {
  const [tool, setTool] = useState('pencil'); // Default tool
  const [color, setColor] = useState('#000000'); // Default stroke color

  return (
    <div className="App">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
      />
      <WhiteBoard socket={socket} tool={tool} color={color} />
    </div>
  );
};

export default App;
