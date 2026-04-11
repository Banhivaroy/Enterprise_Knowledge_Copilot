import Landing from './Components/Landing'
import './App.css'
import { Routes,Route,useLocation } from 'react-router-dom'
import SignUp from './Components/SignUP'
import SignIn from './Components/SignIn'
import ForgotPassword from './Components/SignIn-ForgotPassword'
import ChatInterface from './Components/chatInterface'
function App() {
  
  const location = useLocation();
  return (
    <>
    
    <Routes location={location} key={location.pathname}>
      <Route path = "/" element = {<Landing/>}/>
      <Route path = "/signup" element={<SignUp/>}/>
      <Route path = "/signin" element = {<SignIn/>}/>
      <Route path = "/forgotpassword" element = {<ForgotPassword/>}/>
      <Route path = "/chat" element = {<ChatInterface/>}/>
    </Routes>
      
    </>
  )
}

export default App
