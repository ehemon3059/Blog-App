import React, { useEffect, useState } from 'react'
import PostAuthor from '../Components/PostAuthor'
import { Link, useParams } from 'react-router-dom'

import Loder from '../Components/Loader'
import DeletePost from './DeletePost'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import Loader from '../Components/Loader'
import axios from 'axios'



const PostDetails = () => {

  const {id}= useParams();
  const [post, setPost] = useState(null);
  const [error, setError]= useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {currentUser} = useContext(UserContext)
 

  useEffect(()=>{
      const getPost = async() =>{
      setIsLoading(true)
      try { 
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/posts/${id}`);

        setPost(response.data)
       // console.log(response.data)

      } catch (error) {
        setError(error)
      }
      setIsLoading(false)

    }
    getPost();
  },[])

  if(isLoading){
    return <Loader/>
  }

  return (
    
      <div className="post-detail">
        { error && <p className='error'>{error}</p>}
        {
         post && <div className="container post-detail_container">
          <div className="post-detail_header">
              <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>


              {currentUser?.id == post?.creator && <div            className="post-details-buttons">
                  <Link to={`/posts/${post?._id}/edit`} className='btn sm primary'>Edit</Link>
                  {/* <Link to={`/posts/jjkdg/delete`} className='btn sm danger'>Delete</Link> */}
                  
                <DeletePost postId={id}/>
                
                </div>
              }

              
          </div>

          <h1>{post.title} </h1>
          <div className="post-details_thumbnil">
            <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}   alt="" />
      
          </div>
          <p dangerouslySetInnerHTML={{__html: post.description}}></p>
         
        </div>
        }
      </div>
  
  )
}

export default PostDetails
