const router = require('express').Router()
const userController = require('../controller/userController')
const { checkToken } = require('../middleware/')
const multer = require('multer')

const date_ob= new Date()
const date = ("0" + date_ob.getDate()).slice(-2)
const month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
const year = date_ob.getFullYear()
const hours = date_ob.getHours()
const minutes = date_ob.getMinutes()
const seconds = date_ob.getSeconds()

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
     },
    filename: function (req, file, cb) {
        cb(null , month+ date+ year+ hours+ minutes+ seconds)
    }
})

const upload = multer({ storage : storage})

// user register
router.post('/register',userController.registerUser)

// user login
router.post('/login', userController.loginUser)

// mengambil username
router.get('/name', checkToken, userController.getUserName)

// mengambil foto profile user
router.get('/profile', checkToken, userController.getProfile)

// update username
router.put('/name', checkToken, userController.updateUserName)

// update userEmail
router.put('/email', checkToken, userController.updateUserEmail)

// update profile
router.put('/profile', checkToken, upload.single('profile'), userController.updateProfile)

// update idCard
router.put('/id', upload.single('idCard'), userController.updateIdCard)

// menghapus akun
router.delete('/del', checkToken, userController.deleteUser)

module.exports = router