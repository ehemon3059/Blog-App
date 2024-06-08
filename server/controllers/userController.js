const bcrypt= require('bcryptjs')
const jwt =require("jsonwebtoken")
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require("uuid")


const HttpError = require("../models/errorModel");
const User = require("../models/UserModel");



//Register A New User
//POST : api/users/register
//Unprotected
const registerUser = async(req,res,next)=>{
    try {
        const {name,email,password,confirmPass} = req.body;
        if(!name || !email || !password){
            return next(new HttpError("Faill is all fields.", 422))
        }
        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email:newEmail})
        if(emailExists){
            return next(new HttpError("Email already exists.",422))
        }
        if((password.trim()).length <6 ){
            return next(new HttpError("Password should be at least 6 characters.",422))
        }

        if(password != confirmPass){
            return next(new HttpError("Password did not match",422))
        }

        const salt =  await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password,salt);
        const newUser = await User.create({name,email: newEmail, password: hashPass})
        res.status(201).json(`New user ${newUser.email} registered`)

    } catch (error) {
        return next(new HttpError("User registration failed", 422))
    }
}



//Login Register user
const loginUser = async(req,res,next)=>{
    try {
      const {email,password}= req.body;
      if(!email || !password){
        return next(new HttpError("fill in all fildes.",422))

      } 
      const newEmail = email.toLowerCase();
      const user = await User.findOne({email:newEmail});
      if(!user){
        return next(new HttpError("Email did not Match"))
      } 
      const comparePassword = await bcrypt.compare(password, user.password);
      if(!comparePassword){
        return next(new HttpError("Password did not match"));
      }

      const {_id:id,name} = user;
      const token = jwt.sign({id,name}, process.env.jwt_secret,{expiresIn: "1d"})

      res.status(200).json({token,id,name})

    } catch (error) {
        return next(new HttpError("Login failed. Please check your credentials",422))

    }
}



//User Profile
//POST : api/users/:id
// PROTECTED
const getUser = async(req,res,next)=>{
   try {
    const {id} = req.params;
    const user = await User.findById(id).select('-password');
    if(!user){
        return next(new HttpError("User Not Found.",404))
    }
    res.status(200).json(user);
   } catch (error) {
    return next(new HttpError(error))
   }
}
//Change Avater
//POST : api/users/change-avater
// PROTECTED
const changeAvater = async(req, res, next)=>{
 

    // try {
    //     res.json(req.files)
    //     console.log(req.files)
    // } catch (error) {
    //     return next(new HttpError(error))
    // }
   
        try {
            if(!req.files.avatar){
                return next(new HttpError("Please choose an Image.",422))
    
            }
            //find user from database
            const user = await User.findById(req.user.id)
            //delete old avater if exists
            if(user.avatar){
                fs.unlink(path.join(__dirname,'..','uploads',user.avatar),(err)=>{
                    if(err){
                        return next(new HttpError(err))
                    }
                })
            }
             //const {avatar} = req.files;
             const avatar = req.files.avatar;
            //check file size
            if(avatar.size > 500000){ 
                return next(new HttpError("Profile picture too big. should be less than 500b"),422)

            }
            let filename;
            filename = avatar.name;
            let splittedFilename = filename.split('.');
            let newFileName = splittedFilename[0]+ uuid() + '.' +splittedFilename[splittedFilename.length -1]
            avatar.mv(path.join(__dirname,'..','uploads', newFileName), async(err)=>{
            if(err){
                return next(new HttpError(err))
            }

            const updatedAvater = await User.findByIdAndUpdate(req.user.id, {avatar: newFileName}, {new:true})
            if(!updatedAvater){
                return next(new HttpError("Avater couldn't be change.",422))
            }
            res.status(200).json(updatedAvater)
            })
        } catch (error) {
            return next(new HttpError(error))
        }

 }




//Edit User Details
//POST : api/users/edit-user
// PROTECTED
const editUser =async (req,res,next)=>{
    try {
        const {name,email,currentPassword,newPassword,newConfirmPassword} = req.body;
        if(!name || !email || !currentPassword || !newPassword){
            return next(new HttpError("Fill in all fields",422))
        }
        
        //get user from database
        const user = await User.findById(req.user.id);
        if(!user){
            return next(new HttpError("User not found.",403))
        }
        //make user new email dosen't already exist
        const emailExists = await User.findOne({email});
        //we want to update other details with/without changing the email(which is a unique id because we use it to login)
        if(emailExists && (emailExists._id != req.user.id)){
            return next(new HttpError("Email already exist.",422))
        }

        //compare current password to db password
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if(!validateUserPassword){
            return next(new HttpError("Invalid current password",422))
        }

        //compare new password
        if(newPassword !== newConfirmPassword){
            return next(new HttpError("New password and confirm password did not match",422))
        }

        //hash new password
        const salt  = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword,salt)

        //update user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password:hash}, {new:true})

        res.status(200).json(newInfo)

    } catch (error) {
        return next(new HttpError(error))
    }
}


//GET Authors
//POST : api/users/authors
// UNPROTECTED
const getAuthors = async(req,res,next)=>{
  try {
    const authors = await User.find().select('-password');
    res.json(authors)
  } catch (error) {
    return next(new HttpError(error))
  }
}

module.exports = {registerUser,loginUser,getUser,changeAvater,editUser,getAuthors}