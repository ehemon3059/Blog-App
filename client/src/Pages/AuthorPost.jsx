import React, { useEffect, useState } from 'react'
import PostItem from '../Components/PostItem'
import Loader from '../Components/Loader'
import { useParams } from 'react-router-dom';
import axios from 'axios';


const AuthorPost = () => {
  
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {id} = useParams()
  
  useEffect(()=>{
    const fetchData = async()=>{
     const response= await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/posts/users/${id}`);
     setPosts(response.data)
    }
    fetchData()
  },[])
  
  if (isLoading) {
    return <Loader />;
  }
 

    //console.log(posts)// Log the length of posts after it's updated


  return (
    <section className='posts'>
       { posts.length > 0 ? <div className="container posts__container">
        {
            posts.map(({_id:id,thumbnail,category,title,description,creator,createdAt})=>(
                <PostItem key={id} thumbnail={thumbnail} category={category} title={title} description={description} authorID={creator} postId={id} createdAt={createdAt}></PostItem>
            ))
        }
        </div>: <h2 className='center'>No Post Found</h2>}

      
    </section>
  )
}

export default AuthorPost
