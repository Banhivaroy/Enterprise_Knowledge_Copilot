import {useNavigate} from "react-router-dom"
function Navbar() {
    const navigate = useNavigate();
    
  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        
        <div className="navbar-logo">
          Enterprise Knowledge Copilot
        </div>
        
       
        <div className="navbar-actions">
          <button className="signin-btn" onClick={() => navigate("/signup")}>Sign Up</button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
