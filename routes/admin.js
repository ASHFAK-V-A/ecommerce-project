const express =require('express')
const adminRouter=express()
const adminController =require('../controls/adminControler')
const UserController = require('../controls/UserController')
const VerfyLogin=require('../midlweare/session')
adminRouter.set('view engine','ejs')

adminRouter.get('/', VerfyLogin.VerifyLoginAdmin, adminController.getadminhome)

adminRouter.get('/admin-signin',adminController.adminsignin)

adminRouter.post('/admin-login',adminController.postadminlogin)

adminRouter.get('/admin-logout',adminController.admingetlogout) 

adminRouter.get('/addproducts', VerfyLogin.VerifyLoginAdmin,adminController.addproducts) 

adminRouter.post('/postproduct',adminController.postproducts)

adminRouter.get('/category',VerfyLogin.VerifyLoginAdmin,adminController.category)

adminRouter.post('/addCategory',adminController.addcategory)

adminRouter.post('/editCategory/:id',adminController.editCategory)

adminRouter.get('/restore-category/:id',VerfyLogin.VerifyLoginAdmin,adminController.restorecategory)

adminRouter.get('/delete-category/:id', adminController.deleteCategory)

adminRouter.get('/ProductDetails', VerfyLogin.VerifyLoginAdmin,adminController.ProductDetail) 
 
adminRouter.get('/edit-product/:id',adminController.editproduct)

adminRouter.post('/post-editedprotect/:id',adminController.postedit)

adminRouter.get('/deleteProduct/:id',adminController.deleteproduct)

adminRouter.get('/restoreProduct/:id',adminController.restoreProduct)

adminRouter.get('/userDetails', VerfyLogin.VerifyLoginAdmin,adminController.getusers)

adminRouter.get('/blockUser/:id', adminController.blockuser)
 
adminRouter.get('/UnblockUser/:id', adminController.UnblockUser)

adminRouter.get('/dashboard',adminController.dashboard)

adminRouter.get('/coupon', VerfyLogin.VerifyLoginAdmin,adminController.coupon)

adminRouter.post('/addCoupon',VerfyLogin.VerfyLoginUser,adminController.addCoupon)

adminRouter.post('/editCoupon/:id',adminController.editcoupon)

adminRouter.get('/deleteCoupon/:id',adminController.deletecoupon)

adminRouter.get('/restoreCoupon/:id',adminController.restorecoupon)

adminRouter.get('/orderreport',VerfyLogin.VerifyLoginAdmin, adminController.orderreport)

adminRouter.post('/orderStatuschange/:id',VerfyLogin.VerifyLoginAdmin,adminController.orderStatus)

adminRouter.get('/orderedProductview/:id',VerfyLogin.VerifyLoginAdmin,adminController.orderedProductview)

adminRouter.get('/salesReport',VerfyLogin.VerifyLoginAdmin,adminController.salesReport)

adminRouter.get('/dailyReport',VerfyLogin.VerifyLoginAdmin,adminController.dailysales)

adminRouter.get('/monthlyReport',VerfyLogin.VerifyLoginAdmin,adminController.monthlyreport)

adminRouter.get('/banner',VerfyLogin.VerifyLoginAdmin,adminController.banner)

adminRouter.post('/addBanner',VerfyLogin.VerifyLoginAdmin,adminController.addbanner)

adminRouter.post('/edit-banner/:id',VerfyLogin.VerifyLoginAdmin,adminController.editbanner)

adminRouter.get('/delete-banner/:id',VerfyLogin.VerifyLoginAdmin,adminController.deletebanner)

adminRouter.get('/restore-banner/:id',VerfyLogin.VerifyLoginAdmin,adminController.restorebanner)
module.exports=adminRouter 