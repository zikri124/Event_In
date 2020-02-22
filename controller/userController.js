require('dotenv').config()
const db = require('../database')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.JWT_KEY

const registerUser = async (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const isEmail = validator.isEmail(email)
    if (isEmail) {
        const [rows] = await db.query('select * from users where email = ? limit 1',
            [email])
        if (rows.length == 0) {
            const phoneNum = req.body.phoneNum
            const [rows2] = await db.query('select * from users where phoneNum = ? limit 1',
            [phoneNum])
            if(rows2.length == 0){
                const password = req.body.password
                const hashedPassword = await bcrypt.hash(password, 11)
                db.query('insert into users(name, email, password, phoneNum) values(?,?,?,?)',[name, email, hashedPassword, phoneNum])
                .then(()=>{
                    res.json({
                        "success" :true,
                        "message" : "Register success!"
                    })
                })
                .catch((err)=>{
                    res.status(500)
                    res.json({
                        "success" : false,
                        "error" : err
                    })
                })
            }else{
                res.status(409)
                const error = new Error("Phone number already registered")
                next(error)
            }
        }else {
            res.status(409)
            const error = new Error("Email already registered")
            next(error)
        }
    }else{
        res.status(409)
            const error = new Error("Your email is incorrect")
            next(error)
    }
}

const loginUser = async (req, res, next) =>{
    const email = req.body.email
    const [rows] = await db.query('select * from users where email = ?',
    [email])
    if(rows.length != 0){
        const user = rows[0]
        const password = req.body.password
        bcrypt.compare(password, user.password)
        .then(async()=>{
            const payload = {
                "id_user" : user.id,
                "email" : user.email,
            }
            const token = await jwt.sign(payload, JWT_KEY)
            if(token){
                res.json({
                    "success" : true,
                    "token" : token
                })
            }else{
                const error = new Error("JWT Error, cant create token")
                next(error)
            }
        })
        .catch(()=>{
            const error = new Error("Incorrect password")
            next(error)
        })
    }else{
        const error = new Error("You seems not registered yet")
        next(error)
    }
}

const getUserName = async(req,res,next) =>{
    const id=req.user.id_user
    const [rows] = await db.query('select name from users where id = ?',
            [id])
    if (rows.length > 0) {
        res.json({
            "success": true,
            "name": rows[0]
        })
    } else {
        res.status(404)
        const error = new Error("User Not Found")
        next(error)
    }
}

const getProfile= async(req,res,next) =>{
    const id = req.user.id_user
    const [rows] = await db.query('select profile from users where id = ?',
            [id])
    if (rows.length > 0) {
        res.json({
            "success": true,
            "profile": rows[0]
        })
    } else {
        res.status(404)
        const error = new Error("User Not Found")
        next(error)
    }
}

const updateUserName = (req, res, next) => {
    const id = req.user.id_user
    const newName = req.body.name
    db.query('update users set name = ? where id = ?', [newName, id])
        .then(() => {
            res.json({
                "success": true,
                "message": "Change name success"
            })
        })
        .catch(() => {
            res.status(404)
            const error = new Error("User Not Found")
            next(error)
        })
}

const updateUserEmail = (req, res, next) => {
    const id = req.user.id_user
    const newEmail = req.body.email
    db.query('update users set email = ? where id = ?', [newEmail, id])
        .then(() => {
            res.json({
                "success": true,
                "message": "Change name success"
            })
        })
        .catch(() => {
            res.status(404)
            const error = new Error("User Not Found")
            next(error)
        })
}


const updateProfile = (req,res) => {
    const id=req.body.id
    const profile=req.file.filename
    try {
        db.query('update users set profile=? where id=?',[profile,id])
        res.send(req.file)
    }catch(err){
        res.send(400)
    }
}

const updateIdCard = (req,res) => {
    const id=req.body.id
    const idCard=req.file.filename
    try {
        db.query('update users set idCard=? where id=?',[idCard,id])
        res.send(req.file)
    }catch(err){
        res.send(400)
    }
}

const deleteUser = (req, res, next) => {
    const id = req.user.id_user
    db.query('delete from users where id = ?', [id])
        .then(() => {
            res.json({
                "success": true,
                "message": "delete success"
            })
        })
        .catch(() => {
            res.status(404)
            const error = new Error("User Not Found")
            next(error)
        })
}

const userController = {
    registerUser,
    loginUser,
    getUserName,
    getProfile,
    updateUserName,
    updateUserEmail,
    updateProfile,
    updateIdCard,
    deleteUser
}

module.exports = userController