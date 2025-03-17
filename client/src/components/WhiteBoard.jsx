import { useEffect, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const WhiteBoard = ({
  socket,
  tool,
  color,
  lines,
  setLines,
  history,
  setHistory,
}) => {
  const isDrawing = useRef(false);

  // Emit drawing data to the server
  const emitDrawing = (line) => {
    socket.emit('drawing', line);
  };

  // Handle mouse down (start drawing)
  const handleMouseDown = (e) => {
    isDrawing.current = true;

    const pos = e.target.getStage().getPointerPosition();
    const newLine = { points: [pos.x, pos.y], tool, color };

    setLines((prevLines) => [...prevLines, newLine]);
    setHistory([]);
    emitDrawing(newLine); // Emit the new line
  };

  // Handle mouse move (drawing in progress)
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setLines((prevLines) => {
      if (prevLines.length === 0) return prevLines;

      const newLines = [...prevLines];
      const lastLine = { ...newLines[newLines.length - 1] };

      lastLine.points = [...lastLine.points, point.x, point.y];
      newLines[newLines.length - 1] = lastLine;

      emitDrawing(lastLine);
      return newLines;
    });
  };

  // Handle mouse up (stop drawing)
  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // Listen for incoming drawing data
  useEffect(() => {
    socket.on('drawing', (line) => {
      setLines((prevLines) => [...prevLines, line]);
    });

    return () => {
      socket.off('drawing');
    };
  }, [socket]);

  const handleUndo = () => {
    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      setHistory((prevHistory) => [...prevHistory, lastLine]);
      setLines((prevLines) => prevLines.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (history.length > 0) {
      const lastHistory = history[history.length - 1];
      setLines((prevLines) => [...prevLines, lastHistory]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  };
  // Listen for undo/redo events from the server
  useEffect(() => {
    socket.on('undo', handleUndo);
    socket.on('redo', handleRedo);

    return () => {
      socket.off('undo', handleUndo);
      socket.off('redo', handleRedo);
    };
  }, [socket, lines, history]);

  return (
    <div className="canvas">
      <h3 className="text-center font-bold">X-Board</h3>
      <Stage
        width={window.innerWidth - 50}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              stroke={line.tool === 'eraser' ? '#FFFFFF' : line.color}
              strokeWidth={line.tool === 'eraser' ? 10 : 5}
              points={line.points}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default WhiteBoard;
