import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);
root.render(
  <>
    <h1>💖 Hello World!</h1>
    <h2>Hello from React!</h2>
    <p>Welcome to your Electron application.</p>
    <p>{(window as any).versions.node()}<br />Chrome version: {(window as any).versions.chrome()}<br />Electron version: {(window as any).versions.electron()}</p>
  </>
);