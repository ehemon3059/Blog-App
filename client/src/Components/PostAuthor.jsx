import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'


TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const PostAuthor = ({authorID,createdAt}) => {

  const [author, setAuthor] = useState({})

  useEffect(()=>{
    const getAuthor = async() =>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/${authorID}`)
        setAuthor(response?.data)
    
      } catch (err) {
        console.log(err)
      }
    } 

    getAuthor()
  },[])

  return (
    <div>
     <Link to={`/posts/users/${authorID}`} className='post-author'>
        <div className="post_author_avatar">
            <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${author?.avatar}`} alt="" />
        </div>
        <div className="post_author_details">
            <h5>By: {author?.name}</h5>
            <small><ReactTimeAgo date={new Date(createdAt)} locale='en-us'  /></small>
        </div>
     </Link>
    </div>
  )
}

export default PostAuthor
