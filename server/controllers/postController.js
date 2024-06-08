const Post = require('../models/postModel');
const User = require('../models/UserModel');
const path = require('path');
const fs=require('fs');
const {v4:uuid}= require('uuid')
const HttpError = require('../models/errorModel')


//========================== Create A Post
//POST: api/posts
//PROTECTED
const createPost = async(req,res,next)=>{
   try {
    let {title,category,description}=req.body;
    if(!title || !category ||  !description){
        return next(new HttpError("Fill in all fields and choose thumbnail.",422))
    }
    const {thumbnail} = req.files;
    //check the file size
    if(thumbnail.size > 2000000){
        return next(new HttpError("thumbnail too big. file should be less then 2mb"))

    }
    let filename = thumbnail.name;
    let splittedFilename = filename.split('.')
    let newFileName = splittedFilename[0] + uuid()+"."+splittedFilename[splittedFilename.length - 1]
    thumbnail.mv(path.join(__dirname,'..','/uploads',newFileName), async(err)=>{
        if(err){
            return next(new HttpError(err))
        }else{
            const newPost = await Post.create({title,category,description,thumbnail:newFileName, creator:req.user.id})
            if(!newPost){
                return next(new HttpError("Post colud not be created.",422))

            }
            //Find user and increate post count by 1
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser.posts + 1;
            await User.findByIdAndUpdate(req.user.id, {posts: userPostCount});
            res.status(201).json(newPost)
        }
    })

   } catch (error) {
    return next(new HttpError(error))
   }
}


//========================== Get All Post
//POST: api/posts/
//UNPROTECTED
const getPosts = async(req,res,next)=>{
   try {
    const posts = await Post.find().sort({updatedAt: -1})
    res.status(200).json(posts)
   } catch (error) {
    return next(new HttpError(error))
   }
}


//========================== get A single  Post
//POST: api/posts/:id
//UNPROTECTED
const getPost = async(req,res,next)=>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return next(new HttpError("No Post Found.",404))
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//========================== get A Post by Category
//POST: api/posts/categories/:category
//UNPROTECTED
const getCatPosts = async(req,res,next)=>{
    try {

        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.status(200).json(catPosts)
        
    } catch (error) {
        return next(new HttpError(error))
    }
}


//========================== get AUTHOR POST
//GET: api/posts/users/:id
//UNPROTECTED
const getUserPost = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const posts = await Post.find({creator:id}).sort({createdAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//========================== Edit POST
//PATCH: api/posts/:id
// PROTECTED
const editPost = async(req,res,next)=>{
    try {
        let filename;
        let newFileName;
        let updatePost;
        const postId = req.params.id;
        let {title,category, description} = req.body;

        //ReactQuill has a paragraph opening and  closing tag with a break rag in between so there are 11 characters in there already
        if(!title || !category || description.length < 12){
            return next(new HttpError("Fill in All fields.",422))
        }
        //get old post from database
        const oldPost = await Post.findById(postId);

        if(req.user.id == oldPost.creator){
            if(!req.files){
                updatePost = await Post.findByIdAndUpdate(postId,{title,category,description},{new:true})

            }else{
                //get old post from database
                const oldPost = await Post.findById(postId);
                // delete old thumbnail from upload
                fs.unlink(path.join(__dirname,'..','uploads', oldPost.thumbnail), async(err)=>{
                    if(err){
                        return next(new HttpError(err))
                    }
                    
                });

                //upload new thumbnail
                const {thumbnail} = req.files
                //check file size
                if(thumbnail.size > 2000000){
                    return next(new HttpError("thumbnail too big . should be less then 2mb"))
                }
                filename = thumbnail.name;
                let splittedFilename  = filename.split('.')
                newFileName = splittedFilename[0]+uuid()+ "." +splittedFilename[splittedFilename.length -1]
                thumbnail.mv(path.join(__dirname, '..','uploads', newFileName), async (err) => {
                    if(err){
                        return next(new HttpError(err))
                    }
                });
                updatePost = await Post.findByIdAndUpdate(postId, {title,category,description,thumbnail: newFileName}, {new:true})
            }
        }else{
            return next(new HttpError("author not permit to update"))
        }
        if(!updatePost){
            return next(new HttpError("coludn't update post"))
        }
        res.status(200).json(updatePost)

    } catch (error) {
        return next(new HttpError(error))
    }
}
//========================== delete POST
//DELETE: api/posts/:id
//PROTECTED
const deletePost = async(req,res,next)=>{
    try {
        const postId = req.params.id;
        if(!postId){
            return next(new HttpError("Post unavailable",400))
        }

        const post = await Post.findById(postId);
        const filename = post?.thumbnail;
        if(req.user.id == post.creator){
            //delete thumbnail from uploads folder
            fs.unlink(path.join(__dirname,'..','uploads',filename), async(err)=>{
                if(err){
                    return next(new HttpError(err))
                }else{
                    await Post.findByIdAndDelete(postId);
                    //find user and reduce post count by 1
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts -1;
                    await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
                    res.json(`Post ${postId} delete successfully`)
                }
            });
        }else{
            return next(new HttpError("Post could not be deleted",403))
        }
       

       
    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {createPost,getPosts,getPost,getCatPosts,getUserPost,editPost,deletePost}