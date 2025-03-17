import { useState } from 'react';
import { io } from 'socket.io-client';

// components
import WhiteBoard from './components/WhiteBoard';
import Toolbar from './components/Toolbar';

const socket = io('http://localhost:3001');

const App = () => {
  const [lines, setLines] = useState([]); // All drawn lines
  const [history, setHistory] = useState([]); // History for undo/redo
  const [tool, setTool] = useState('pencil'); // Default tool
  const [color, setColor] = useState('#000000'); // Default stroke color

  // Undo functionality
  const undo = () => {
    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      setHistory([...history, lastLine]); // Add to history
      setLines(lines.slice(0, -1)); // Remove last line
      socket.emit('undo'); // Emit undo event to server
    }
  };

  // Redo functionality
  const redo = () => {
    if (history.length > 0) {
      const lastHistory = history[history.length - 1];
      setLines([...lines, lastHistory]); // Add back the last undone line
      setHistory(history.slice(0, -1)); // Remove from history
      socket.emit('redo'); // Emit redo event to server
    }
  };

  return (
    <div className="App">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        undo={undo}
        redo={redo}
      />
      <WhiteBoard
        socket={socket}
        tool={tool}
        color={color}
        lines={lines}
        setLines={setLines}
        history={history}
        setHistory={setHistory}
      />
    </div>
  );
};

export default App;
