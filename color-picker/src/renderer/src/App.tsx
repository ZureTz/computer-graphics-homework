import Versions from "./components/Versions";
import ColorInput from "./components/ColorInput";

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased py-10 px-6 flex flex-col items-center gap-8 selection:bg-sky-500/30 selection:text-white">
      <header className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent drop-shadow">
          Color Picker
        </h1>
        <p className="text-sm text-zinc-400">Electron + React + Tailwind</p>
        <button
          onClick={ipcHandle}
          className="inline-flex items-center gap-2 rounded-md bg-sky-600/90 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:scale-[0.97] px-4 h-10 text-sm font-medium shadow transition-all"
        >
          Send IPC
        </button>
      </header>

      <div className="w-full max-w-xl grid gap-8">
        <Versions />
        <ColorInput />
      </div>

      <footer className="mt-auto pt-8 text-[11px] text-zinc-500">
        Built for homework – {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
