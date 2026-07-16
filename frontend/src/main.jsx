import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "react-hot-toast";
import './index.css'
import App from './App.jsx'
import 'remixicon/fonts/remixicon.css'

createRoot(document.getElementById('root')).render(
  
    <>
    <App />
    <Toaster
        position="bottom-right"
        toastOptions={{
            duration: 2500,
            style: {
                background: "#252526",
                color: "#ffffff",
                border: "1px solid #3c3c3c",
            },
        }}
    />
</>
    
  ,
)
