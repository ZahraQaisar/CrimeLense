import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './ErrorBoundary'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

// ── PWA Service Worker Registration ──────────────────────────────────────────
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((reg) => console.log('[CrimeLense] SW registered:', reg.scope))
            .catch((err) => console.warn('[CrimeLense] SW registration failed:', err));
    });
}
