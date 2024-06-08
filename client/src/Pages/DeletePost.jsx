import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';

const DeletePost = ({postId:id}) => {

  const [isLoading, setIsloading ] = useState(false);
  
  const navigate = useNavigate()

  const location = useLocation();
  
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  //redirect to login page for any user who is'nt logged in 

  useEffect(()=>{
   if(!token){
    navigate('/login')
   } 
  }, [])

  const removePost = async(id)=>{
    setIsloading(true)
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/posts/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

     // console.log(response);

      if(response.status == 200){
        if(location.pathname == `/mypost/${currentUser.id}`){
          navigate(0)
        }else{
          navigate('/')
        }
      }

      setIsloading(flase)

    } catch (error) {
      console.log("couldn't delete post.")
    }
  }


  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      removePost(id);
    }
  };


  if(isLoading){
    return <Loader/>
  }



  return (
    <div>
      <Link className='btn sm danger' onClick={handleDelete}>Delete</Link>
    </div>
  )
}

export default DeletePost
