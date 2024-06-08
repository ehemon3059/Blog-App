import React, { useState ,useContext, useEffect } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {


  const [title,setTitle] =useState('');
  const [category,setCategory] = useState('Uncategorized');
  const [discription,setDiscription] = useState('');
  const [thumbnil,setThumbnil] = useState('')
  const [error, setError] = useState()
  
  const navigate = useNavigate()
  
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  //redirect to login page for any user who is'nt logged in 

  useEffect(()=>{
   if(!token){
    navigate('/login')
   } 
  }, [])


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

  const createPost = async(e)=>{
    e.preventDefault();

    const postData = new FormData();
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', discription)
    postData.set('thumbnail', thumbnil)
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/posts`,postData,{withCredentials:true, headers:{Authorization: `Bearer ${token}`}})
      console.log(response.data)
      if(response.status == 201){
        return navigate('/')
      }
      
    } catch (err) {
      setError(err.response.data.message)
    }

  }

  return (
    <section className='create-post'>
      <div className="container">
        <h2>Create Post</h2>
        { error && <p className="form_error_message">
          {error}
        </p>}
        <form action="" className="create_post_form" onSubmit={createPost}>
          <input type="text" placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)} />
          <select name="category" className='create-post-select' value={category} onChange={(e)=>setCategory(e.target.value)} id="">
            {
              POST_CATEGORY.map((cat,index)=> <option key={index}>{cat}</option>)
            }
           
          </select>
          <ReactQuill modules={modules} formats={formats} value={discription} onChange={setDiscription}/>
          <input type="file" onChange={(e)=>setThumbnil(e.target.files[0])} accept='png,jpg,jpeg' name="" id="" />
            <button type="submit" className='btn primary'>Create</button>
        </form>
      </div>
      
    </section>
  )
}

export default CreatePost
