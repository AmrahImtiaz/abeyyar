import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { UserProvider } from "./context/userContext";
import { GoogleOAuthProvider } from '@react-oauth/google'; 

// I have pasted your specific Client ID below
//const clientId = "89216457442-s3qi8t3gg92qfacnl69rhobbhtko1cd4.apps.googleusercontent.com";
const clientId = "573181003954-i5mkn6lqp0sealetk5kmcsrvaeek2r5n.apps.googleusercontent.com";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
        <UserProvider>
          <App />
          <Toaster />
        </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)