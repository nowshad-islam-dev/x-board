const Toolbar = ({ tool, setTool, color, setColor }) => {
  return (
    <div className="absolute top-2 left-2 z-50 p-2 bg-white shadow-lg rounded-lg flex space-x-2">
      <button
        onClick={() => setTool('pencil')}
        className={`px-4 py-2 rounded-md ${
          tool === 'pencil' ? 'font-bold bg-gray-200' : 'bg-gray-100'
        }`}
      >
        Pencil
      </button>
      <button
        onClick={() => setTool('eraser')}
        className={`px-4 py-2 rounded-md ${
          tool === 'eraser' ? 'font-bold bg-gray-200' : 'bg-gray-100'
        }`}
      >
        Eraser
      </button>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-10 h-10 border rounded-md cursor-pointer"
      />
    </div>
  );
};

export default Toolbar;
