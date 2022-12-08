const express =require('express')
const adminRouter=express()
const adminController =require('../controls/adminControler')

adminRouter.set('view engine','ejs')

adminRouter.get('/',adminController.getadminhome)

adminRouter.get('/admin-signin',adminController.adminsignin)

adminRouter.post('/admin-login',adminController.postadminlogin)

adminRouter.get('/admin-logout',adminController.admingetlogout) 

adminRouter.get('/addproducts',adminController.addproducts) 

adminRouter.post('/postproduct',adminController.postproducts)

adminRouter.get('/category',adminController.category)

adminRouter.post('/addCategory',adminController.addcategory)

adminRouter.post('/editCategory/:id',adminController.editCategory)

adminRouter.get('/delete-category/:id',adminController.deleteCategory)

adminRouter.get('/ProductDetails',adminController.ProductDetail) 
 
adminRouter.get('/edit-product/:id',adminController.editproduct)

adminRouter.post('/post-editedprotect/:id',adminController.postedit)

adminRouter.get('/deleteProduct/:id',adminController.deleteproduct)

adminRouter.get('/restoreProduct/:id',adminController.restoreProduct)

adminRouter.get('/userDetails',adminController.getusers)

adminRouter.get('/blockUser/:id',adminController.blockuser)
 
adminRouter.get('/UnblockUser/:id',adminController.UnblockUser)



module.exports=adminRouter 