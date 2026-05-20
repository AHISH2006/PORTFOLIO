import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
const originalWarn = console.warn;

console.warn = (...args) => {
  const msg = args[0];

  if (
    typeof msg === "string" &&
    (
      msg.includes("THREE.Clock") ||
      msg.includes("deprecated parameters")
    )
  ) {
    return;
  }

  originalWarn(...args);
};
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)