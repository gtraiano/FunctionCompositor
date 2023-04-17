import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { StateProvider } from './state'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StateProvider>
    <React.StrictMode>
        <App />
    </React.StrictMode>
  </StateProvider>,
)
