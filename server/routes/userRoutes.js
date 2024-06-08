const {Router} = require('express');


const {registerUser,loginUser,getUser,getAuthors,changeAvater,editUser} = require("../controllers/userController")

 const authMiddleWare = require('../middleware/AuthMiddleware')

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/change-avater',authMiddleWare, changeAvater)
router.put('/edit-user',authMiddleWare, editUser)


module.exports = router;