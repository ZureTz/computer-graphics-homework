import PixelCanvas from "./components/PixelCanvas";
import Versions from "./components/Versions";

function App(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-fit bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <PixelCanvas />
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-4">
        <Versions />
      </div>
    </div>
  );
}

export default App;
