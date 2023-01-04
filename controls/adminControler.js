

const products = require("../models/ProductSchema")
const user=require('../models/UserSchema')
const categories=require('../models/Cateogary')
const coupon =require('../models/coupon')
const moment = require('moment')
const banner = require('../models/banner')
const order = require("../models/order")




moment().format()

let email='admin@gmail.com'
let Password='123'
let err='invalid password or email'



module.exports={


      getadminhome:async(req,res)=>{
        

        
      const orderData = await order. find({ orderStatus: { $ne: "cancelled" } })
      
      const totalRevenue = orderData.reduce((accumulator, object) => {
        return accumulator + object.totalAmount;
  
  

    }, 0);


    const todayOrder = await order.find({
        orderDate: moment().format("MMM DO YY"),
        orderStatus: { $ne: "cancelled" }
    });

    const todayRevenue = todayOrder.reduce((accumulator, object) => {
        return accumulator + object.totalAmount;
    }, 0);
               
    const start = moment().startOf("month");

    const end = moment().endOf("month");
  
    const oneMonthOrder = await order.find({ orderStatus: { $ne: "cancelled" }, createdAt: { $gte: start, $lte: end }, })

    const monthlyRevenue = oneMonthOrder.reduce((accumulator, object) => {
        return accumulator + object.totalAmount;
    }, 0);

         
    const pending = await order.find({ orderStatus: "pending" }).count();

    const conformed = await order.find({ orderStatus: "Order confirmed" }).count();

    const delivered = await order.find({ orderStatus: "Delivered" }).count();

    const cancelled = await order.find({ orderStatus: "Canecl" }).count();

    const cod = await order.find({ paymentMethod: "COD" }).count();

    const online = await order.find({ paymentMethod: "Online" }).count();

    const product = await products.find({ delete: false }).count();


    const allOrders = await order.find().count();
    
    const activeUsers = await user.find({ isBlocked: false }).count();
    
           owner=true
           console.log(delivered);    
                  res.render('admin/dashboard',{totalRevenue,todayRevenue,monthlyRevenue,delivered,
                    conformed,cancelled,pending,allOrders,activeUsers,product,cod,online,cancelled})
     
      
     
     },
 
    // login and logout process

    adminsignin:(req,res)=>{

        if(req.session.isAdmin){

           res.redirect('/admin')
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
        await categories.deleteOne({_id:id})
    
        await categories.updateOne({_id:id},{$set:{
            delete:true
        }})
        res.redirect('/admin/category')
        }catch{
            console.log(err);
            res.render('user/500')
        }
    
    
    
    
},




// USER LIST

getusers:async(req,res)=>{
   


        const users=await user.find()

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
    
  },
  

    orderreport: async (req, res) => {

        try {

            order.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: "orderIteams.productId",
                        foreignField: "_id",
                        as: "product",
                    }
                },
                
                    {
                        $lookup: {
                           from: "users",
                           localField: "userId",
                           foreignField: "_id",
                           as: "user",
                        
                       }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },

            ]).then((orderdetails) => {
                owner=true
                res.render('admin/orderdetails', { orderdetails,owner })

            })

        } catch (err) {

            console.log(err);
            res.render('user/500')
      
        }


    },

    orderStatus:async(req,res)=>{
        try{
        const id = req.params.id
        const data = req.body
        console.log(data);

        await order.updateOne(
            {_id:id},
            {
                $set:{
                    orderStatus:data.orderStatus,
                    paymentStatus:data.paymentStatus
                }
            }
        )
        
       res.redirect('/admin/orderreport')
    }catch(err){
console.log(err);
}

},


orderedProductview:async(req,res)=>{
    const id = req.params.id
    const objId = mongoose.Types.ObjectId(id)
    const ProductData = await order.aggregate([
        {
          $match:{_id:objId}
        },
        {
          $unwind:"$orderItems"
        },
        {
          $project:{
            iteam:"$orderItems.productId",
            quantity:"$orderItems.quantity",
            address:1,
            phonenumber:1,
          name:1,

          }
        },
        {
          $lookup:{
            from:"products",
            localField:"iteam",
            foreignField:"_id",
            as:"productDetail"
          
        }
      },
      {
        $project :{
          iteam:1,
          quantity: 1,
          name: 1,
          phonenumber: 1,
          address: 1, 
          deliveryDate:1,
          productDetail: { $arrayElemAt: ["$productDetail", 0] },
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'productDetail.category',
          foreignField: "_id",
          as: "category_name"
        }
      },
        {
          $unwind: "$category_name"
        },
     
      {
        $addFields: {
            productPrice: {
              $multiply: ["$quantity", "$productDetail.price"]
            }
          }
      }
      ]).exec();
      const sum = ProductData.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
      }, 0);

console.log(sum);
owner=true
res.render('admin/orderdprodcutview',{ProductData,owner,sum})
},

      
salesReport :async(req,res)=>{
    try{

      const allOrderDetails = await order.find({
          paymentStatus:"paid",
          orderStatus:"Delivered"
      })


      res.render('admin/salesReport',{allOrderDetails})

    }
    catch{
      res.render('user/error')
    }
     
  },


  dailysales:(req,res)=>{
  
      try{
              order.find({
                $and:[
                    {paymentStatus:"paid",orderStatus:"Delivered"}
                    ,{
                        orderDate:moment().format("MMM Do YY"),
                    }
                ]
              }).then((allOrderDetails)=>{
  
                res.render("admin/salesReport", { allOrderDetails });
              })
      }catch{

      }

  },

  monthlyreport: async(req,res)=>{
     
try{
const start = moment().startOf("month")
const end = moment().endOf("month")
      
  await order.find({
    $and:[
        {
           paymentStatus:"paid",orderStatus:"Delivered"
        },
        {
            createdAt:{
                $gte:start,
                $lte:end,
            }
        }
    ]
  }).then((allOrderDetails)=>{

    res.render('admin/salesReport',{allOrderDetails})
  })


}catch(err){
console.log(err);
}


  },

banner:async(req,res)=>{

   const banners =await banner.find()

    res.render('admin/banner',{banners})
},

addbanner:async(req,res)=>{

try{

const body = req.body

await banner.create({
    offerType:body.offerType,
    bannerText:body.bannerText,
    couponName:body.couponName
})

res.redirect('/admin/banner')   
}catch{

}

 
},

editbanner:async(req,res)=>{
    try{
       
           const id=req.params.id

           await banner.updateOne(

            {_id:id},
            {
                $set:{
                    offerType:req.body.offerType,
                    bannerText:req.body.bannerText,
                    couponName:req.body.couponName
                }
            }
           )

    res.redirect("/admin/banner")


    }catch{

    }

},

deletebanner:async(req,res)=>{
    try{
        
       const id= req.params.id

 await banner.updateOne(
    {_id:id},
    {$set:{
        isDeleted:true
    }}
 )
 res.redirect('/admin/banner')


    }catch{

    }
},

restorebanner:async(req,res)=>{
    const id= req.params.id
   
     await banner.updateOne(
        {_id:id},
        {$set:{
            isDeleted:false
        }}
     )
res.redirect("/admin/banner")

}

  


}