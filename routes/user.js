const express=require('express')
const userRouter=express()

const userController=require('../controls/UserController')

const VerfySession=require('../midlweare/session')


userRouter.set('view engine','ejs')


userRouter.get('/',userController.getHome)

userRouter.get('/login',userController.getlogin)

userRouter.post('/login',userController.postlogin)


userRouter.get('/signup',userController.getsignup)

userRouter.get('/logout', userController.getlogout)

userRouter.post('/signup',userController.postsignup)

userRouter.get('/cart',VerfySession.VerfyLoginUser, userController.getCart)

userRouter.get('/otp', VerfySession.VerfyLoginUser,userController.getotp)
 
userRouter.post('/otpid',userController.postotp)

userRouter.get('/addtocart/:id',userController.addTocart)

userRouter.get('/viewproduct/:id', VerfySession.VerfyLoginUser,userController.viewproduct)

userRouter.get('/addtocart/:id',userController.addTocart)

userRouter.get('/viewcart',userController.viewcart)




module.exports=userRouter   