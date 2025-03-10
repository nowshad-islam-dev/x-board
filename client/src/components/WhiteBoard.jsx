import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const WhiteBoard = ({ socket }) => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  // Handle mouse down (start drawing)
  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  // Handle mouse move (drawing in progress)
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    // Add new point to the current line
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // Update the lines array
    setLines([...lines.slice(0, -1), lastLine]);
  };

  // Handle mouse up (stop drawing)
  const handleMouseUp = () => {
    isDrawing.current = false;
  };

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
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              stroke="#000"
              strokeWidth={5}
              points={line.points}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default WhiteBoard;
