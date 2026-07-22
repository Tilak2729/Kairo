import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider } from './context/user.context'
import { Toaster } from 'react-hot-toast'


const App = () => {
  return (
    <>
    <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                }}
            />
    <UserProvider>
      <AppRoutes />
    </UserProvider>
    </>
    
  )
}

export default App
