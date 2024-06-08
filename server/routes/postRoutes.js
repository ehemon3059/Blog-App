const {Router} = require('express');

const {createPost,getPosts,getPost,getCatPosts,getUserPost,editPost,deletePost} =require('../controllers/postController')

const authMiddleware = require("../middleware/AuthMiddleware");

const router = Router()

router.post('/',authMiddleware, createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/categories/:category', getCatPosts)
router.get('/users/:id', getUserPost)
router.put('/:id',authMiddleware, editPost)
router.delete('/:id', authMiddleware,deletePost)

module.exports = router;