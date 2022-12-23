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

userRouter.get('/otp',userController.getotp)

userRouter.post('/otpid',userController.postotp)

userRouter.get('/addtocart/:id',VerfySession.VerfyLoginUser,userController.addTocart)

userRouter.get('/viewproduct/:id', VerfySession.VerfyLoginUser,userController.viewproduct)

 userRouter.post('/change-quantity',userController.changequantity,userController.totalAmount)

 userRouter.get('/viewcart', VerfySession.VerfyLoginUser,userController.viewcart)

 userRouter.post("/removeproduct",userController.removeProduct)

 userRouter.get('/wishlisht/:id',VerfySession.VerfyLoginUser,userController.addToWishlist)

 userRouter.post('/wishlist-remove',VerfySession.VerfyLoginUser,userController.removeFromWishlist)

 userRouter.get('/viewWishlist',VerfySession.VerfyLoginUser,userController.viewWishlist)

userRouter.get('/userprofile',VerfySession.VerfyLoginUser,userController.userprofile)

userRouter.get('/editprofile',VerfySession.VerfyLoginUser,userController.editprofile)

userRouter.get('/shop',VerfySession.VerfyLoginUser,userController.shop)

userRouter.post("/update",VerfySession.VerfyLoginUser,userController.updateprofile)

userRouter.get('/checkout',VerfySession.VerfyLoginUser,userController.checkout)

userRouter.post('/addNewAddress',VerfySession.VerfyLoginUser,userController.addnewaddress)

userRouter.get('/categorywise/:id',VerfySession.VerfyLoginUser,userController.cateogrywiseshoppage)

userRouter.post('/placeOrder',VerfySession.VerfyLoginUser,userController.placeOrder)

userRouter.get('/ordersuccess',VerfySession.VerfyLoginUser,userController.ordersuccess)
module.exports=userRouter    