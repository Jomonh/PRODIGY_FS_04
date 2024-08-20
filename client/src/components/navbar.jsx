import {useContext, useState} from 'react'
import { Link } from 'react-router-dom'
//import { ProtectedContext } from '../App'
export default function Navbar() {
    const [isLoggedIn,setIsLoggedIn]=useState(false);
  //const {isLoggedIn}=useContext(ProtectedContext)
  
  return (
    <nav >
      <div className="navDiv d-flex flex-row align-items-center gap-3 justify-content-around p-2 bg-light" style={{minHeight:'12vh'}}>
          <h3>Chat App</h3>
          <div className="navGrp d-flex flex-row align-items-center gap-3">
            {!isLoggedIn ?
              (<>
                <div className="navElem"><Link to="/">Login</Link> </div>
              </>):(
                  <>
                    <div className="navElem"><Link to="/home">Home</Link> </div>
                    <div className="navElem"><Link to="/profile">Profile</Link> </div>
                  </> 
              )

            }
              <div className="navElem"><Link to="/about">About</Link> </div>
          </div>
      </div>
    </nav>
  )
}
