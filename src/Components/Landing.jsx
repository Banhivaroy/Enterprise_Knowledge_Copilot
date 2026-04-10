import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar/>
      <div className='btn'>
        <button className='get-started' onClick={() =>navigate("/signin") }>Get Started</button>
      </div>
    </div>
  )
}

export default Landing
