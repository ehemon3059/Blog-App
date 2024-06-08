import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { UserContext } from '../context/UserContext';
import axios from 'axios';



const UserProfile = () => {

  const [avatar, setAvater] = useState('')
  


  const[name,setName]= useState('')
  const[email,setEmail]= useState('')
  const[currentPassword,setCurrentPassword]= useState('')
  const[newPassword,setnewPassword]= useState('')
  const[newConfirmPassword,setconfirmPassword]= useState('')
  const [error,setError] = useState('')


  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const navigate = useNavigate()
  
  const {currentUser} = useContext(UserContext)


  const token = currentUser?.token;

  //redirect to login page for any user who is'nt logged in 

  useEffect(()=>{
   if(!token){
    navigate('/login')
   } 
  }, [])


  useEffect(()=>{
    const getUser = async ()=>{

      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/${currentUser.id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); 


      //console.log(response)
      const {name,email,avatar} = response.data;
      setName(name);
      setEmail(email);
      setAvater(avatar)

    }
    getUser();
  },[])

  const changeAvaterHandel = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.append('avatar', avatar); // Use append for FormData
  
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/change-avater`, postData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
    //  console.log("Avatar change response:", response); // Log for debugging
  
      if (response.status === 200) { // Check for successful response
        
        setAvater(response.data.avatar); // Update avatar state if successful
      } else {
        console.error("Error updating avatar:", response.data); // Log error details
      }
    } catch (error) {
      console.error("Error while changing avatar:", error);
    }
  };
  
  
  const handelForm = async(e) =>{
        e.preventDefault()
      try {
        const userData = new FormData();
        userData.set('name',name);
        userData.set('email',email);
        userData.set('currentPassword',currentPassword);
        userData.set('newPassword',newPassword);
        userData.set('newConfirmPassword',newConfirmPassword);

        const responsse = await axios.put(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/edit-user`, userData , {withCredentials:true, headers: {Authorization : `Bearer ${token}`}})

        if(responsse.status == 200){
          //log user Out
          navigate('/logout')
        }

      } catch (error) {
        setError(error.response.data.message)
      }
  }


  return (
    <section  className='profile'>

      <div className="container profile_container">
        <Link to={`/mypost/${currentUser.id}`} className='btn primary'>My Post</Link>
        <div className="profile_details">
          <div className="avater_wrapper">
            <div className="profile_avater">
              <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="" />
            </div>
            {/* form to update avater */}
            <form className="avater_form" >
              <input type="file" name="avatar" id="avatar" accept='png,jpg,jpeg' onChange={(e)=> setAvater(e.target.files[0])}/>
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)} ><FaEdit /></label>
            </form>
            { isAvatarTouched && <button className='profile_avater-btn' onClick={changeAvaterHandel}><FaCheck /></button> }
          </div>
          <h1>{currentUser.name}</h1>
          <form action="" className="form profile-form" onSubmit={handelForm}>
            { error && <p className="form_error_message">{error}</p>}
            <input type="text" name="name" id="name" placeholder='full name ' value={name} onChange={(e)=>setName(e.target.value)}/>

            <input type="text" name="email" id="email" placeholder='Email ' value={email} onChange={(e)=>setEmail(e.target.value)}/>

            <input type="password" name="currentPassword" id="currentPassword" placeholder='Current Password ' value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}/>

            <input type="password" name="newPassword" id="newPassword" placeholder='New Password' value={newPassword} onChange={(e)=>setnewPassword(e.target.value)}/>

            <input type="password" name="newConfirmPassword" id="newConfirmPassword" placeholder='Confirm Password' value={newConfirmPassword} onChange={(e)=>setconfirmPassword(e.target.value)}/>

            <button type="submit" className='btn primary'>Update Details</button>
          </form>
        </div>
      </div>
      
    </section>
  )
}

export default UserProfile
