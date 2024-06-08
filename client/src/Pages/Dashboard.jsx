import React, { useContext, useEffect, useState } from 'react'
import {Dummy_POSTS} from '../Data'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import Loader from '../Components/Loader'
import axios from 'axios'
import DeletePost from './DeletePost'

const Dashboard = () => {
  const [posts, setPosts] = useState([])

  const [isLoading, setIsloading ] = useState(false);

  const {id} = useParams()



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

    const fetchPosts = async () =>{
      setIsloading(true);
    

    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/posts/users/${id}`,{withCredentials: true,headers: { Authorization: `Bearer ${token}` },});

     // console.log(response.data)
      setPosts(response.data)


    } catch (error) {
      console.log(error)
    }
    setIsloading(false)
    }
    fetchPosts()
  },[id])

  if(isLoading){
  return  <Loader/>
  }

  return (
    <section className='dashboard'>
      {
        posts.length ? <div className='container dashboard_container'>
          {
            posts.map(post =>{
              return <article key={post._id} className='dashboard_post'>
                      <div className="dashboard_post_info">
                        <div className="dashboard_post-thumbnil">
                          <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
                        </div>
                        <h5>{post.title}</h5>
                      </div>
                      <div className="dashboard_post_action">
                        <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
                        <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                        <DeletePost postId={post._id}/>
                      </div>
              </article>
            })
          }
        </div>
        :<h2 className='center'>You have no post</h2>
      }
    </section>
  )
}

export default Dashboard
