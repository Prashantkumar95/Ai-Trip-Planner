import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './create-trip'
import Header from './components/custom/Header'
import { Toaster } from './components/ui/sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Viewtrip from './view-trip/[tripId]'
import MyTrips from './my-trips'
import { BrowserRouter } from 'react-router-dom'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/create-trip',
    element: <CreateTrip/>
  },
  {
    path: '/view-trip/:tripId',
    element: <Viewtrip/>
  },
  {
    path: '/my-trips',
    element: <MyTrips/>
  }
])

// Add client ID verification
const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;
if (!clientId) {
  console.error("Missing Google OAuth Client ID - check your .env file");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Header/>
        <Toaster/>
        <RouterProvider router={router}/>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)