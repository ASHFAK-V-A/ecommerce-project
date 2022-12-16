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

userRouter.get('/otp', VerfySession.VerfyLoginUser,userController.getotp)

userRouter.post('/otpid',userController.postotp)

userRouter.get('/addtocart/:id',VerfySession.VerfyLoginUser,userController.addTocart)

userRouter.get('/viewproduct/:id', VerfySession.VerfyLoginUser,userController.viewproduct)

 userRouter.post('/changeQuantity',VerfySession.VerfyLoginUser,userController.changeQuantity)

 userRouter.get('/viewcart', VerfySession.VerfyLoginUser,userController.viewcart)

 userRouter.post("/removeproduct",userController.removeProduct)

 userRouter.get('/wishlisht',VerfySession.VerfyLoginUser,userController.wishlist)


module.exports=userRouter   