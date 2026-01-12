import React from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './pages/Home'
import Signup from './pages/Signup'
import {Login} from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import QuestionDetail from "./pages/QuestionDetail"
import Verify from './pages/Verify'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOTP'
import ChangePassword from './pages/ChangePassword'
import AuthSuccess from './pages/AuthSuccess'
import BrowseQuestion from './pages/browsequestion'
import Chatpage from './pages/Chatpage'
import Userprofile from './pages/Userprofile'
import About from "./pages/About"
import Askquestion from "./pages/askquestion"
const router = createBrowserRouter([
 {
  path: '/',
  element: (
 <>
 <ProtectedRoute>
      <Navbar />
      <Home />
      </ProtectedRoute>
  </>
  )
},
  {
    
    path:'/signup',
    element:
    <>
    
    <Signup/>
    
  </>
  },
  {
    
    path:'/verify',
    element:
    <>
    
    <VerifyEmail/>
    
    </>
  },
  {
    path:'/verify/:token',
    element:
    <>
    
    <Verify/>
    
    </>
  },
  {
    path:'/login',
    element:
    <>

<Login/>
    
    </>
  },
  {
    path:'/auth-success',
    element:
    <>
    
    <AuthSuccess/>
    
    </>
  },
  {
    path:'/forgot-password',
    element:
    <>
  
    <ForgotPassword/>
   </>
    
  },
  {
    path:'/verify-otp/:email',
    element:<VerifyOTP/>
  },
  {
    path:'/change-password/:email',
    element: 
    <ChangePassword/>
  
  },
  {

    path:'/about',
    element:
    <>
    <ProtectedRoute>
    <About/>
    </ProtectedRoute>
    </>
  
  
  },
  
  {
    path:'/browsequestions',
    element:
    <>
<ProtectedRoute>
    
    <BrowseQuestion/>
 </ProtectedRoute>
    </>   

  },
  {
    path:'/askquestion',
    element:
    <>
    <ProtectedRoute>
    <Askquestion/>
    </ProtectedRoute>
    </>
  

  },
  {
  path: "/questions/:id",
  element: 
  <>
  <ProtectedRoute>
  <QuestionDetail />
</ProtectedRoute>
    </>

},
{
  path: "/chatwithai",
  element: 
  <>
  <ProtectedRoute>
  <Chatpage />
</ProtectedRoute>
    </>
},
{
  path: "/Userprofile",
  element: 
  <>
  <ProtectedRoute>
  <Userprofile />
  </ProtectedRoute>
  </>
},


])

const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
