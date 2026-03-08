import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('✅ SW registered, scope:', reg.scope);
        reg.update();
      })
      .catch((err) => {
        console.error('❌ SW failed:', err);
      });
  });
}
