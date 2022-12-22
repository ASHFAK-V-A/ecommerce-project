

const products = require("../models/ProductSchema")
const user=require('../models/UserSchema')
const categories=require('../models/Cateogary')
const coupon =require('../models/coupon')
const moment = require('moment')
const { find } = require("../models/UserSchema")
moment().format()

let email='admin@gmail.com'
let Password='123'
let err='invalid password or email'

module.exports={


      getadminhome:(req,res)=>{
       
            owner=true
           res.render('admin/admin-home',{owner})
     
        
      
     
     },
 
    // login and logout process

    adminsignin:(req,res)=>{

         if(req.session.isAdmin){
           
            res.redirect('/admin/admin-home')
         }else{
           owner=false
             res.render("admin/admin-login")
         }
       
    },



    postadminlogin:(req,res)=>{
        if(req.body.email===email && req.body.Password===Password){
            req.session.isAdmin=true
            res.redirect('/admin')
        }else{
    
            res.redirect('/admin/admin-signin')
        }
    },

    admingetlogout:(req,res)=>{ 
        req.session.destroy((err)=>{
            if(err) throw err;
            owner=false
            res.render('admin/admin-login')
        })
    },


// 


// nav iteams

addproducts:async (req,res)=>{ 
    if(req.session.isAdmin){
        let category=await categories.find();
        res.render('admin/addproducts',{category})
    }else{
        res.redirect('/admin/admin-signin')
    } 
},


ProductDetail:async(req,res)=>{
   
    let product = await products.find().populate('category')

      res.render('admin/ProductDetails',{product})   
      console.log(product);

 },


postproducts:async(req,res)=>{

const image =req.files.image;
console.log(image);

const Product =new products({
    product_name:req.body.product_name,
    price:req.body.price,
    category:req.body.category_name,
    description:req.body.description,
    stock:req.body.stock

})  

 const ProductDetails= await Product.save()
 if(ProductDetails){
    let productId =ProductDetails._id
    console.log("productId"+productId);
    image.mv('./public/products-Images/'+productId +'.jpg', (err)=>{
        if(!err){
            res.redirect('/admin/ProductDetails')
        }else{
            res.redirect('/admin/addproducts')
        }
    })
 }
 

},

editproduct:async(req,res)=>{
 const id =req.params.id
 const category = await categories.find()    
 const productData = await products.findOne({_id:id})
res.render('admin/edit-product',{category,productData})


},

postedit: async(req,res)=>{
const id =req.params.id
 await products.updateOne({_id:id},{$set:{
    product_name:req.body.name,
    price:req.body.price,
    category:req.body.category_name,
    description:req.body.description,
    stock:req.body.stock

 }}) 
 if(req?.files?.image ){
    const image=req.files.image
    image.mv('./public/products-images/'+id+'.jpg',(err)=>{
        if(!err){
            res.redirect('/admin/ProductDetails')
        }else{
            console.log(err);
        }
    })
 }else{
    res.redirect('/admin/ProductDetails') 
 }

},

deleteproduct:async(req,res)=>{
    const id=req.params.id
    console.log(id);
    await products.updateOne({_id:id},{$set :{delete:true}}).then(()=>{
    res.redirect('/admin/ProductDetails')
    })
    
},
restoreProduct:async(req,res)=>{
    const id = req.params.id;
    await products.updateOne({_id:id}, {$set: {delete:false } }).then(()=>{
        res.redirect('/admin/productdetails')
    })
},



category:async(req,res)=>{
    try{

        const category= await categories.find()
        let productfound=req.session.err
        req.session.err = " "
        owner=true
       res.render('admin/cateogary',{productfound,category,owner})  
    }catch{
 console.log(err);
 res.render('user/500')
    }
},


addcategory:async(req,res)=>{
    try{

    if(req.body.category_name){
        const category_name=req.body.category_name
        console.log(category_name);
      const category=await categories.findOne({category_name:category_name}) 

    if(category){
        req.session.err="product already exist"
         res.redirect('/admin/category')
    }else{
        const category = new categories({
            category_name:req.body.category_name
        })
        await category.save()
        res.redirect('/admin/category') 
    
    } 
 
        }else{
            res.redirect('/admin/category')
        }
    }catch{
        console.log(err);
        res.render('user/500')
    }

},

editCategory:async(req,res)=>{
    try{
if(req.body.name){
    const name=req.body.name

    const findName = await categories.findOne({category_name:name})

if(!findName){
    const id=req.params.id
    await categories.updateOne({_id:id},{$set:{
        category_name:req.body.name
    }})
    res.redirect('/admin/category')
}else{
    res.redirect('/admin/category')
}

}else{
    res.redirect('/admin/category')
}
    }catch{
        console.log(err);
        res.render('user/500')
    }
},





deleteCategory:async (req,res)=>{
    try{
    const id=req.params.id
    console.log(id);

    await categories.updateOne({_id:id},{$set:{
        delete:true
    }})
    res.redirect('/admin/category')
    }catch{
        console.log(err);
        res.render('user/500')
    }
    
},

restorecategory:async(req,res)=>{
    const id = req.params.id
    console.log('restore'+id);
    await categories.updateOne({_id:id},
        {$set: {delete:false}})
    res.redirect('/admin/category');
},


// USER LIST

getusers:async(req,res)=>{
   
        const users=await user.find()
        console.log(users);
        res.render('admin/userDetails',{users})   
  
 
},

blockuser:async(req,res)=>{
    const id =req.params.id

    await user.updateOne({_id:id},{$set:{isBlocked:true}}).then((err)=>{
        res.redirect('/admin/userDetails')
        console.log(err);
    })
 
},


UnblockUser:async(req,res)=>{
    const id =req.params.id
    await user.updateOne({_id:id},{$set:{isBlocked:false}}).then(()=>{
        res.redirect('/admin/userDetails')
       
    })
},

dashboard:(req,res)=>{
    res.render('admin/dashboard')
},

coupon: async(req,res)=>{
    const couponData= await coupon.find()  
    res.render('admin/coupon',{couponData})
  },

  addCoupon:(req,res)=>{
    try{
     const data = req.body
     const dis= parseInt(data.discount)
     const maxLimit = parseInt(data.maxLimit)
     const discount = dis/100

    coupon.create({
              couponName:data.couponName,
              discount  :discount,
              maxLimit  :maxLimit,
              expirationTime:data.expirationTime
      
            }).then((data)=>{
              console.log(data);
              res.redirect('/admin/coupon')

            })

    }catch{
             console.log(err)
    }


  },
  editcoupon:(req,res)=>{
    try{
    const id = req.params.id
    const data= req.body

// matching with mongodb id and product id
    coupon.updateOne({_id:id},{
        couponName: data.couponName,
        discount  : data.discount/100,
        maxLimit  : data.maxLimit,
        expirationTime: data.expirationTime
    }).then(()=>{
           res.redirect('/admin/coupon')
    })


 
  }catch{
    console.log(err);
  }
  },

  deletecoupon: async(req,res)=>{
 const id = req.params.id
 await coupon.updateOne({_id : id},{$set: {delete : true}})
 res.redirect('/admin/coupon')


  },

  restorecoupon: async(req,res)=>{
    const id = req.params.id
    await coupon.updateOne({_id : id},{$set: {delete : false}})
    res.redirect('/admin/coupon')
    
  }
  



}