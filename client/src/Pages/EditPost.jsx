import React, { useContext, useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const EditPost = () => {


  
  const [title,setTitle] =useState('');
  const [category,setCategory] = useState('');
  const [description,setDiscription] = useState('');
  const [thumbnail,setThumbnil] = useState('')
  const [error, setError] = useState('')




  const navigate = useNavigate()

  const {id} = useParams()
 

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  //redirect to login page for any user who is'nt logged in 

  useEffect(()=>{
   if(!token){
    navigate('/login')
   } 
  }, [])

  useEffect(()=>{
    const getPost = async ()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/posts/${id}`);

       // console.log(response.data)

        setTitle(response.data.title)
        setDiscription(response.data.description)
      } catch (err) {
        setError(err.response.data.message)
      }
    }

    getPost();
  },[])



const modules= {
  toolbar: [
    [{ header: [1, 2,3,4,5,6, false] }],
    ['bold', 'italic', 'underline','strike','blockquote'],
    [{'list':'orderred'},{'list':'bullet'},{'indent':'-1'},{'indent':'+1'}],
    ['link','image'],
    ['clean']

  ],
}

const formats = [
  'header',
  'bold','italic','underline','strike','blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

  const POST_CATEGORY = ['Agriculture','Business','Education','Entertainment','Art','Investment','Uncategorized','Weather'];


  const editPost = async (e)=>{
    e.preventDefault();


    const postData = new FormData();
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', description)
    postData.set('thumbnail', thumbnail)
    try {
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BASE_URL}/posts/${id}`, postData,{withCredentials:true, headers:{Authorization: `Bearer ${token}`}})

      console.log(response)
      if(response.status == 200){
        return navigate('/')
      }
      
    } catch (err) {
      setError(err.response.data.message)
    }


  }

  return (
    <section className='create-post'>
    <div className="container">
      <h2>Edit Post</h2>
      { error && <p className="form_error_message">
        {error}
      </p>}
      <form action="" className=" form create_post_form" onSubmit={editPost}>
        <input type="text" placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)} />
        <select name="category" value={category} onChange={(e)=>setCategory(e.target.value)} id="">
          {
            POST_CATEGORY.map((cat,index)=> <option key={index}>{cat}</option>)
          }
         
        </select>
        <ReactQuill modules={modules} formats={formats} value={description} onChange={setDiscription}/>
        <input type="file" onChange={(e)=>setThumbnil(e.target.files[0])}  accept='png,jpg,jpeg' name="" id="" />
          <button type="submit" className='btn primary'>Update</button>
      </form>
    </div>
    
  </section>
  )
}

export default EditPost
