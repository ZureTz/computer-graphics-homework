import { createRoot } from 'react-dom/client';
import ColorInput from './components/color-input';

const root = createRoot(document.body);
root.render(
  <>
    <h1>💖 Hello World!</h1>
    <h2>Hello from React!</h2>
    <p>Welcome to your Electron application.</p>
    <ColorInput />
  </>
);