import React from 'react'
import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'


const PostItem = ({postId,authorID,description,title,category,thumbnail,createdAt}) => {

    const shortDescrition = description.length > 145 ? description.substr(0,145)+'...Read More' : description
    const PostTitle = title.length > 30 ?title.substr(0,30)+'...' : title
   return (
    <article className="post ">
      <div className="post_thumbnail">
        <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
      </div>
      <div className="post__content">
        <Link to={`/posts/${postId}`}>
            <h3>{PostTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{__html: shortDescrition}}></p>
        <div className="post__footer">
            <PostAuthor  authorID={authorID} createdAt={createdAt} />
            <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
        </div>
      </div>
    </article>
  )
}

export default PostItem
