
const UserModel = require('../models/UserSchema')
const bcrypt = require('bcrypt');
const emailregex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const Products = require('../models/ProductSchema')
require('dotenv').config()
const mailer=require('../midlweare/otpvalidation')
const cart = require('../models/CartSchema')
const mongoose = require('mongoose');
const wishlist = require('../models/wishlistSchema');
const categories = require('../models/Cateogary');
const coupon = require('../models/coupon')
const order = require ('../models/order');
const moment = require('moment')


let name
let email
let Password
let phone
let countInCart;
let profileusername;
let countInWishlist;


async function emailExists(email) {
  const userfound = await UserModel.findOne({ email: email })
  if (userfound) {
    return true;
  } else {
    return false;
  }
}

function checkCoupon(data,id){
  return new Promise((resolve)=>{
    if(data.coupon){
      coupon.find(
        {couponName: data.coupon},
        {users: { $elemMatch : { userId:id}}}
      )
      .then((exist)=>{
    
        if(exist[0].users.length){
       
          resolve(true)

        }else{
          coupon.find({ couponName: data.coupon}).then((discount)=>{
            resolve(discount)
          })
        }
      })
    }else{
      resolve(false)
    }
  })
}


module.exports = {
  getHome: async (req, res) => {
    
    if (req.session.isUser) {
      customer = true
      let usern=req.session.isUser
      let  userDatas= await UserModel.findOne({email:usern})
      profileusername = userDatas.username
 
      res.render('user/home',{countInCart,customer,profileusername,countInWishlist})
    } else {
      customer = false
      res.render('user/home') 
    }

  },


  
shop: async(req,res)=>{
  
  if (req.session.isUser) {
    let category= await categories.find()
    const product = await Products.find({delete:false}).populate('category')


    customer = true


    res.render('user/shop', {countInCart,profileusername,countInWishlist,product,category})
  } else {
    customer = false
    res.render('user/home')  
  }

},




cateogrywiseshoppage: async(req,res)=>{

  const id =req.params.id
  console.log(id);
  const category = await categories.find()
  const product = await Products.find({category : id}).populate('category')

console.log(product); 
customer=true

res.render('user/shop',{product,category,countInCart,countInWishlist,profileusername,customer})
},




  getlogin: (req, res) => { 
    res.render('user/login')
  },


  postlogin: async (req, res) => {

    const { email, Password } = req.body
    const user = await UserModel.findOne({ email })
    try {
      if (user) {
        if (user.isBlocked == false) {
          const passwordMatch = await bcrypt.compare(Password, user.Password)
          if (passwordMatch) {
            req.session.isUser =req.body.email
 
            res.redirect('/')
          } else {
            res.render('user/login')
          }
        } else {
          res.render('user/login', { blocked: "You can't login" })
        }
      } else {
        res.render('user/login')
      }
    } catch (error) {
      console.log(error);
    }
  },
  getsignup: (req, res) => {
    
    res.render('user/signup')
  },


  // Signup Validation
  postsignup:async (req,res)=>{
   
      
        const ValidEmail=emailregex.test(req.body.email)
        const  ValiPassword=PasswordRegex.test(req.body.Password)
 
        if(req.body.Password === req.body.CPassword){

             const userExist= await emailExists(req.body.email)


          if(userExist==true){
          console.log('user exist');
          res.render('user/signup',{msg:'User Already Exist'})
    
          } else if(!ValidEmail && !ValiPassword){  
            console.log('ivaid password or email');
            res.render('user/signup')

    

         }else{ 
                    
               bcrypt.hash(req.body.Password,12).then((data)=>{


                    name=req.body.username,  
                    email=req.body.email,
                    phone=req.body.phone,
                    Password=data
             
           const mailDetails={
            from:process.env.EMAIL,
            to:email,
            subject : 'Otp for TheMenFactory',
            html: `<p>Your OTP for registering in TheMenFactory is ${mailer.OTP}</p>`,
           }
           mailer.mailTransporter.sendMail(mailDetails,function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect('/otp')  
            }
              
           

               }) 
              })
              
            }
            
        }else{
          res.render('user/signup') 
        }
          },


          getotp:(req,res)=>{
           
              res.render('user/otp') 
       
           
          },

   
            postotp: (req,res)=>{
              const otp = req.body.otp
                if(mailer.OTP == otp){
                  UserModel.create({
                    username: name,
                    phone: phone,
                    email: email,
                    Password: Password
                 }).then(()=>{
                  res.redirect('/login')
                 }) 
                  
                }else{ 
                  res.render('user/otp',{invalid:'invalid otp'})
                  
                 }
              
              },

  
  getlogout: (req, res) => { 
    req.session.destroy((err) => {
      if (err) throw err;
      customer=false
      res.redirect('/')
    })
  },

 
  getCart: (req, res) => {

      res.render('user/cart')

  },


  addTocart: async(req,res)=>{

    console.log('api cal');
    // Product Id
    const proid=req.params.id

    // User Id
    let session=req.session.isUser

    // product id conver to object model
    const objId = mongoose.Types.ObjectId(proid)


    let proObj = {
      productId : objId,
      quantity : 1,
  };;

  const UserData= await UserModel.findOne({email:session})

  const userCart = await cart.findOne({userId :UserData._id})

    if(userCart){
 
      let proExist =userCart.product.findIndex(
      (product) =>product.productId== proid
      )


    if(proExist !=-1){
  await cart.aggregate([
     {
      $unwind :"$product"
     }
   ])
  await cart.updateOne(
    {userId:UserData._id,"product.productId":objId},
    {$inc :{"product.$.quantity" :1}}
    ) 
    res.redirect('/viewcart')  
  }else{
    cart
       .updateOne({ userId: UserData._id }, { $push: { product: proObj } })
       .then(() => {
    
         res.redirect("/viewcart");    
   
       }); 
}

    }else{
      const newCart = new cart ({
        userId:UserData._id,

        product:[{
          productId:objId,
           quantity:1
        }
      ]
      })
      newCart.save().then(()=>{
        res.redirect('/viewcart')
       
      })

  }
},

viewcart: async(req,res)=>{
const session = req.session.isUser

const userData=await UserModel.findOne({email:session})

const ProductData =await cart.aggregate([
  {
    $match: {userId:userData.id}  
  },
   
{
  $unwind:'$product'
},
 
{
  $project:{
    iteam:'$product.productId',
    quantity:"$product.quantity"
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
  
    $project: {
        iteam: 1,
        quantity: 1,
        productDetail: { $arrayElemAt: ["$productDetail", 0] },
      },

},
{
  $addFields: {
      productPrice: {
        $multiply: ["$quantity", "$productDetail.price"]
      }
    }
}
 
])

.exec();
const sum = ProductData.reduce((accumulator, object) => {
  return accumulator + object.productPrice;
}, 0);


countInCart = ProductData.length


res.render('user/cart',{ProductData,countInCart,sum,profileusername, countInWishlist})

},

changequantity : (req,res,next)=>{   
  const data = req.body
  const objId = mongoose.Types.ObjectId(data.productId)

  if(data.count == -1 && data.quantity == 1){
       cart.updateOne( 
        {_id: data.cartId, "product.productId":objId},
        {$pull : { product : { productId:objId }}} 
       )
       .then(()=>{ 
       res.json({quantity:true})   
       })  
  }else{
    cart.updateOne( 
      { _id: data.cartId, "product.productId":objId},
      { $inc:{"product.$.quantity": data.count }}
     ).then(()=>{ 
        next()
     })
  }
  
  
}, 
totalAmount: async (req, res) => {

  let session = req.session.isUser;
  const userData = await UserModel.findOne({ email: session });
  const productData = await cart.aggregate([
    {
      $match: { userId: userData.id },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        item: "$product.productId",
        quantity: "$product.quantity",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "item",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $project: {
        item: 1,
        quantity: 1,
        productDetail: { $arrayElemAt: ["$productDetail", 0] },
      },
    },
    {
      $addFields: {
        productPrice: {
          $multiply: ["$quantity", "$productDetail.price"], 
        },
      },
    },
    {
      $group: {
        _id: userData.id,
        total: {
          $sum: { $multiply: ["$quantity", "$productDetail.price"] },
        },
      },
    },
  ]).exec();
  res.json({ status: true, productData });

},
  



  viewproduct:async(req,res)=>{
      const id =req.params.id
      const product = await Products.findOne({_id:id}).populate('category')
  console.log(product);
    res.render('user/viewproduct',{product,countInCart,profileusername, countInWishlist })
    
  },


  removeProduct:async(req,res)=>{
    const data = req.body;
    await cart.aggregate([
      {
        $unwind: "$product"
      }
    ])
    await cart
      .updateOne(
        { _id: data.cartId, "product.productId": data.product },
        { $pull: { product: { productId: data.product } } }
      )
      .then(() => { 
        res.json({ status: true });
   
      });
  },

  addToWishlist: async (req, res) => {

    const id = req.params.id;
    const objId = mongoose.Types.ObjectId(id);
    const session = req.session.isUser;

    let proObj = {
      productId: objId,
    };

    const userData = await UserModel.findOne({ email : session })
    const userWishlist = await wishlist.findOne({ userId : userData._id})


    if (userWishlist) {

      let proExist =userWishlist.product.findIndex(
        (product) => product.productId == id
      );
      if (proExist != -1) {

        res.redirect('/viewWishlist')
      } else {

        wishlist.updateOne(
          { userId: userData._id }, { $push: { product: proObj } }
        ).then(() => {
          res.redirect('/viewWishlist')
        });
      }
    } else {
      const newWishlist = new wishlist({
        userId: userData._id,
        product: [
          {
            productId: objId,

          },
        ],
      });
      newWishlist.save().then(() => {
        res.redirect('/viewWishlist')
      });
    }

  },
  viewWishlist: async (req, res) => {

    const session = req.session.isUser;
    const userData = await UserModel.findOne({ email: session })
    const userId = mongoose.Types.ObjectId(userData._id);;

    const wishlistData = await wishlist
      .aggregate([
        {
          $match: { userId: userId }
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productItem: "$product.productId",

          }
        },
        {
          $lookup: {
            from: "products",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetail",
          } 
        },
        {
          $project: {
            productItem: 1,
            productDetail: { $arrayElemAt: ["$productDetail", 0] }
          }
        }

      ]) , 
   
      countInWishlist = wishlistData.length


    res.render('user/wishlist', { wishlistData, countInWishlist, countInCart,profileusername  })

  },
   

  removeFromWishlist:async(req,res)=>{
    const data = req.body
    const objId = mongoose.Types.ObjectId(data.productId)
   await wishlist.aggregate([
         {
          $unwind : "$product"
         },
   ]);
   await wishlist.updateOne(
    {_id : data.wishlistId,"product.productId" : objId},
    {$pull: { product: { productId : objId}}}
   )
   .then(()=>{
    res.json({ status : true})
   })

},


userprofile:async(req,res)=>{
  const session =req.session.isUser
  customer=true
  const userData = await UserModel.findOne({email:session})

  res.render('user/userprofile',{countInCart,userData,customer,profileusername, countInWishlist })

},


editprofile:async (req,res)=>{

  const session=req.session.isUser
  customer=true

  const userData= await UserModel.findOne({email:session})
res.render('user/editprofile',{countInCart,customer,userData,profileusername, countInWishlist })
},



updateprofile: async(req,res)=>{



const session=req.session.isUser


await UserModel.updateOne({email:session},
  {
    $set:{
      username:req.body.username,
      phone:req.body.phone,

      addressDetails:[
        {
           housename:req.body.house,
           area:req.body.area,
           landmark:req.body.landmark,
           state:req.body.state,
           postoffice:req.body.postoffice,
           district:req.body.district,
           pin:req.body.pincode,
           houseno:req.body.houseno
           
        }
      ]

    }
   }
  )


  res.redirect('/userprofile')
},


checkout: async(req,res)=>{
const session= req.session.isUser
const userData= await UserModel.findOne({email:session})

const productData = await cart.aggregate([
  {
    $match: { userId: userData.id },
  },
  {
    $unwind: "$product",
  },
  {
    $project: {
      item: "$product.productId",
      quantity: "$product.quantity",
    },
  },
  {
    $lookup: {
      from: "products",
      localField: "item",
      foreignField: "_id",
      as: "productDetail",
    },
  },
  {
    $project: {
      item: 1,
      quantity: 1,
      productDetail: { $arrayElemAt: ["$productDetail", 0] },
    },
  },
  {
    $addFields: {
      productPrice: {
        $multiply: ["$quantity", "$productDetail.price"], 
      },
    },
  }, 
])
.exec()
const sum = productData.reduce((accumulator, object) => {
  return accumulator + object.productPrice;
}, 0); 
customer=true 

console.log();
  res.render('user/checkout',{countInWishlist,countInCart,profileusername,sum,productData,userData,customer})
},


addnewaddress:async (req,res)=>{
  const session = req.session.isUser

  const addNewAddress={
    housename: req.body.housename,
    area: req.body.area,
    landmark: req.body.landmark,
    district: req.body.district,
    state: req.body.state,
    postoffice: req.body.postoffice,
    pin: req.body.pin,
    houseno:req.body.houseno
  }

  await UserModel.updateOne({email:session},{$push:{addressDetails:addNewAddress}})

  res.redirect('/checkout')

},


placeOrder :async (req,res)=>{
     
  let invalid;
  let couponDeleted;
  const data = req.body

  const session = req.session.isUser;
  const userData = await UserModel.findOne({ email: session })
  const cartData = await cart.findOne({ userId: userData._id });
  const objId = mongoose.Types.ObjectId(userData._id)

if(data.coupon){
 
  invalid = await coupon.findOne({ couponName:data.coupon })
 
  if(invalid?.delete == true){

    couponDeleted =true
  }  
}else{
  invalid = 0;
}

if(invalid == null){

  res.json({ invalid: true });
}
else if(couponDeleted){

  res.json({couponDeleted:true})
}
else{

  const discount = await checkCoupon(data,objId)

  if(discount == true){
    res.json({ coupon : true})
  }
  else{
    if (cartData) {
      const productData = await cart
        .aggregate([
          {
            $match: { userId: userData.id },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.productId",
              quantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "item",
              foreignField: "_id",
              as: "productDetail",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              productDetail: { $arrayElemAt: ["$productDetail", 0] },
            },
          },
          {
            $addFields: {
              productPrice: {
                $multiply: ["$quantity", "$productDetail.price"]
              }
            }
          }
        ])
        .exec();
      const sum = productData.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
      }, 0);

      if (discount == false){
         var total = sum;
      }
      else{
        var dis = sum * discount[0].discount
        if(dis > discount[0].maxLimit){
          total = sum-discount[0].maxLimit;

        }else{
          total = sum-dis;
        }
      }

      const orderData = await order.create({
        userId: userData._id,
        name: userData.username,
        phonenumber: userData.phone,
        address: req.body.address,
        orderItems: cartData.product,
        totalAmount: total,
        paymentMethod: req.body.paymentMethod,
        orderDate: moment().format("MMM Do YY"),
        deliveryDate: moment().add(3, "days").format("MMM Do YY")
      })

      // const amount = orderData.totalAmount * 100
      const orderId = orderData._id
      await cart.deleteOne({ userId: userData._id });
      
      if (req.body.paymentMethod === "COD") {
       await order.updateOne({_id:orderId},{$set:{orderStatus:'placed'}})
       
       res.json({ success: true})
       coupon.updateOne(
        {couponName:data.coupon},
        {$push:{users: {userId : objId}}}
       ).then((updated)=>{
        console.log(updated);
       })
      }
    }
  } 
}
},
ordersuccess:(req,res)=>{
  res.render('user/ordersucess')
},


orderdetails:async(req,res)=>{
customer=true
const session = req.session.isUser
const userData=  await UserModel.findOne({email:session})

const orderData = await order.find({userId: userData._id}).sort({createdAt:-1})

  const orderlength = orderData.length
;

  res.render("user/order-history",{countInCart,countInWishlist,customer,profileusername,orderData,orderlength})

 
},

TrackOrder:async(req,res)=>{
  customer=true
  const id = req.params.id
  const objId =  mongoose.Types.ObjectId(id)
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
        deliveryDate:1,
        orderStatus:1,
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
      orderStatus:1,
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
 
  
  ])




res.render('user/track-order',{countInCart,countInWishlist,profileusername,customer,ProductData})
},


cancelorder:async(req,res)=>{
const id = req.params.id
const objId = mongoose.Types.ObjectId(id)

await order.updateOne({ _id: data }, { $set: { orderStatus: "cancelled" } })
res.redirect('/orderhistory')




}




}



 

// muhammadarshad8935@gmail.com


  //password 
  //af10ashfak#ii               