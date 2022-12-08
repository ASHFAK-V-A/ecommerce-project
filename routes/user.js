const express=require('express')
const userRouter=express()

const userController=require('../controls/UserController')

userRouter.set('view engine','ejs')


userRouter.get('/',userController.getHome)

userRouter.get('/login',userController.getlogin)

userRouter.post('/login',userController.postlogin)


userRouter.get('/signup',userController.getsignup)

userRouter.get('/logout',userController.getlogout)

userRouter.post('/signup',userController.postsignup)

userRouter.get('/cart',userController.getCart)

userRouter.get('/otp',userController.getotp)
 
userRouter.post('/otpid',userController.postotp)

userRouter.get('/viewproduct',userController.viewproduct)

module.exports=userRouter   