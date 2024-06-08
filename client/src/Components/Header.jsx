import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../images/logo.png'
import { FaBars } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from '../context/UserContext';


const Header = () => {
  
  const [isNaveShoing, setIsNaveShoing] = useState(window.innerWidth >800 ? true : false)
  
  const {currentUser} = useContext(UserContext)
  const closeNavHandel =()=>{
    if(window.innerWidth < 800){
      isNaveShoing(false)
    }else{
      setIsNaveShoing(true)
    }
  }
  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" onClick={closeNavHandel} >
          <img src={Logo} alt="" className='nav_logo' />
        </Link>
       { currentUser?.id && isNaveShoing && <ul className='nav_menu'>
          <li><Link to={`/profile/${currentUser.id}`} onClick={closeNavHandel}>{currentUser?.name}</Link></li>
          <li><Link to="/create" onClick={closeNavHandel}>Create Post</Link></li>
          <li><Link to="/authors" onClick={closeNavHandel} >Authors</Link></li>
          <li><Link to="/logout" onClick={closeNavHandel}>Logout</Link></li>
        </ul>}
       { !currentUser?.id && isNaveShoing && <ul className='nav_menu'>
          <li><Link to="/authors" onClick={closeNavHandel} >Authors</Link></li>
          <li><Link to="/login" onClick={closeNavHandel}>Login</Link></li>
        </ul>}

        <button className='nav_toggle-btn' onClick={()=>setIsNaveShoing(!isNaveShoing)}>
        {isNaveShoing ?   <AiOutlineClose /> : <FaBars/>}
        </button>

      </div>
      
    </nav> 
  )
}

export default Header
