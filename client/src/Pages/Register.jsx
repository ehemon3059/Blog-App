import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios'



const Register = () => {

  const[userData, setUserData] = useState({
    name:'',
    email:'',
    password:'',
    confirmPass:''
  });

  const [error, setError] = useState('')

  const navigate = useNavigate() 

  const changeInpuHandel=(e)=>{
    setUserData(previousState =>{
      return {...previousState, [e.target.name]: e.target.value}
    })
  }

  const registerUser= async(e)=>{
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/register`, userData);
     
      const newUser =  response.data;

      console.log(newUser);
      if(!newUser){
        setError("Couldn't register user. Please try again")
      }
      navigate("/login")
    } catch (err) {
      setError(err.response.data.message)
    }

}
  
  
  
  return (
    <section className='register'>
      <div className="container">
        <h2>Sign Up</h2>
        <form className='register-from' onSubmit={registerUser}>
         { error && <p className="form_error_message">{error}</p> } 
          <input type="text" placeholder='Full Name' name="name" value={userData.name} onChange={changeInpuHandel} />
          <input type="email" placeholder='Your Email' name="email" value={userData.email} onChange={changeInpuHandel} />
          <input type="password" placeholder='Your Password' name="password" value={userData.password} onChange={changeInpuHandel} />
          <input type="password" placeholder='Confirm Password' name="confirmPass" value={userData.confirmPass} onChange={changeInpuHandel} />
          <button className='btn primary' >Register</button>
        </form>
        <small>Already Have an Account ? <Link to="/login">Sign In</Link></small>
      </div>

      
    </section>
  )
}

export default Register
