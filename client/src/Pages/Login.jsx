import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {UserContext} from '../context/UserContext';

const Login = () => {
 
  const[userData, setUserData] = useState({

    email:'',
    password:''
  
  });


  const [error, setError] = useState("")
  const navigate = useNavigate()

  const {setCurrentUser} = useContext(UserContext)

  const changeInpuHandel=(e)=>{
    setUserData(previousState =>{
      return {...previousState, [e.target.name]: e.target.value}
    })
  }

  const loginUser = async(e)=>{
      e.preventDefault();
      setError("");
      try {
        const response =await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/login`, userData);
        const user =  response.data;
        setCurrentUser(user)
        navigate('/')
      } catch (err) {
        setError(err.response.data.message)
      }
  }

  return (
    <section className='login'>
      <div className="container">
        <h2>Sign in</h2>
        <form className='login-from' onSubmit={loginUser}>
         {error && <p className="form_error_message">{error}</p>} 
          <input type="email" placeholder='Your Email' name="email" value={userData.email} onChange={changeInpuHandel} />
          <input type="password" placeholder='Your Password' name="password" value={userData.password} onChange={changeInpuHandel} />
          <button className='btn primary' >Login</button>
        </form>
        <small>Don't Have an Account ? <Link to="/register">Sign Up</Link></small>
      </div>

      
    </section>
  )
}

export default Login
