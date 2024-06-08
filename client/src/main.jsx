import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './Components/Layout'
import ErrorPage from './Pages/ErrorPage'
import Home from './Pages/Home'
import PostDetails from './Pages/PostDetails'
import Register from './Pages/Register'
import Login from './Pages/Login'
import UserProfile from './Pages/UserProfile'
import Authors from './Pages/Authors'
import CreatePost from './Pages/CreatePost'

import EditPost from './Pages/EditPost'
import AuthorPost from './Pages/AuthorPost'
import Dashboard from './Pages/Dashboard'

import LogOut from './Pages/LogOut'
import CategoryPosts from './Pages/CategoryPosts'
import DeletePost from './Pages/DeletePost'
import UserProvider from './context/UserContext'


const  router = createBrowserRouter([
  { path: '/',
    element:<UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage />,
    children:[
      {index: true, element:<Home/>},
      {path: 'posts/:id', element: <PostDetails/>},
      {path: 'register', element: <Register/>},
      {path: 'login', element: <Login/>},
      {path: 'profile/:id', element: <UserProfile/>},
      {path: 'authors', element: <Authors/>},
      {path: 'create', element: <CreatePost/>},
      // {path: 'posts/:id/edit', element: <EditPost/>},
      {path: 'posts/categories/:category', element: <CategoryPosts/>},
      {path: 'posts/users/:id', element: <AuthorPost/>},
      {path: 'mypost/:id', element: <Dashboard/>},
      {path: '/posts/:id/edit', element: <EditPost/>},
      {path: 'posts/:id/delete', element: <DeletePost />},
      {path: 'logout', element: <LogOut/>},
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
