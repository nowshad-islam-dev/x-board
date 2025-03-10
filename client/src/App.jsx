import { useEffect, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const App = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h3>X-Board</h3>
      <Stage>
        <Layer>
          <Line
            x={0}
            y={0}
            points={[50, 50, 150, 150]}
            stroke="black"
            strokeWidth={5}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
