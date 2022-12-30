
const UserModel = require('../models/UserSchema')
const bcrypt = require('bcrypt');
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
const banner = require('../models/banner');
const otp = require('../models/otp');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

let name
let email
let Password
let phone
var countInCart;
let profileusername;
let countInWishlist


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
 

      const bannerData = await banner.find({ isDeleted:false }).sort({createdAt: -1}).limit(1)

      res.render('user/home',{countInCart,customer,profileusername,countInWishlist,bannerData})
    
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

  const category = await categories.find()
  const product = await Products.find({category : id}).populate('category')


customer=true

res.render('user/shop',{product,category,countInCart,countInWishlist,profileusername,customer})
},




  getlogin: (req, res) => { 
  
    const session = req.session.isUser

    if(session){
      res.redirect('/')
    }else{
      res.render("user/login")
    }
  

  },


  postlogin: async (req, res) => {

 
  
    const { email, Password } = req.body
    const user = await UserModel.findOne({email})
    try {
      if (user) {
        if (user.isBlocked == false) {
          const passwordMatch = await bcrypt.compare(Password, user.Password)
          if (passwordMatch) {
            req.session.isUser =req.body.email
          
            res.redirect('/')
          } else {
            console.log('invalid password');
            res.render('user/login',{msg:'invalid pasword'})
          }
        } else {
          res.render('user/login', { blocked: "You can't login" })
        }
      } else {

        res.render('user/login',{msg:'user not found'})
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
  try{
 
const {email,Password}=req.body

const UserData= await UserModel.findOne({email:email})

if(UserData){
  res.render('user/signup')
}else if(req.body.Password===req.body.CPassword){

  const hash = await bcrypt.hash(req.body.Password,10)


const name = req.body.username
const email = req.body.email
const phone = req.body.phone
const password = hash

const OTP = `${Math.floor(1000 + Math.random() * 9000)}`
const mailDetails = {
    from :process.env.EMAIL,
    to : email,
    subject : 'Otp for TheMenFactory',
    html: `<p>Your OTP for registering in TheMenFactory is ${OTP}</p>`,
}

const User = {
  name :name,
  email:email,
  phone:phone,
  password:password
}
mailer.mailTransporter.sendMail(mailDetails, async function(err){
 if(err){
  console.log(err);
 }else{

  const userfound = await otp.findOne({email:email})
  if(userfound){
    otp.deleteOne({email:email}).then(()=>{
      otp.create({
        email:email,
        otp:OTP
      }).then(()=>{
       
        res.redirect(`/otp?name=${User.name}&email=${User.email}&phone=${User.phone}&password=${User.password}`);

      })

    })
  
 
 }else{
    otp.create({
      email:email,
      otp:OTP
    }).then(()=>{
      res.redirect(`/otp?name=${User.name}&email=${User.email}&phone=${User.phone}&password=${User.password}`);
    })
  }
}
})


}else{
console.log('password doesnt match');
}


  }catch(err){
    console.log(err);
  }
  },

          getotp:(req,res)=>{

          let userData = req.query
       
          res.render('user/otp',{userData}) 
       
           
          },

   
            postotp: async(req,res)=>{
              try{

             

              const body = req.body
              const userData = {
                name:body.name,
                email:body.email,
                phone:body.phone,
                password:body.password

                
              }
         
             
              otp.findOne({email:body.email}).then(async(sendOtp)=>{

  
                         if(req.body.otp == sendOtp.otp){

                          await UserModel.create({
                            username:body.name,
                            phone:body.phone,
                            email:body.email,
                            Password:body.password
                          })
                          console.log('otp success');
                            res.redirect('/login')
                         }else{
                          res.render('user/otp',{invalid:'Invalid OTP',userData})
                         }
    
              })
    

}catch(err){

}
       
},
            

  
forgotpassword:async(req,res)=>{
 
  res.render('user/forgotpassword')
  },
  
  postforgotpassword:async(req,res)=>{
  
    try{
  
      const email = req.body.email
   
      const OTP = `${Math.floor(1000 + Math.random() * 9000)}`
      const mailDetails = {
          from :process.env.EMAIL,
          to : email,
          subject : 'Otp for TheMenFactory',
          html: `<p>Your OTP for registering in TheMenFactory is ${OTP}</p>`,
      }


          const userData= await UserModel.findOne({email:email})

          if(userData){
            mailer.mailTransporter.sendMail(mailDetails,async function(err){
              if(err){
                console.log(err);
              }else{
                otp.findOne({email:email}).then(async(userfound)=>{
                  if(userfound){
                    await otp.deleteOne({email:email})
                  }
                })
                otp.create({
                  email:email,
                  otp:OTP
                }).then(()=>{
                  res.render('user/recivedotp',{email})
                  
                })
              }
            })
          }else{

            res.render('user/forgotpassword',{invalid:"Invalid Email !"})  
          }


    }catch(err){
  
    }
  
  
  },

  forgotpassotp:async(req,res)=>{
const body =  req.body
const email = body.email
const usernewpassword = await otp.findOne({email:email})
if(body.otp == usernewpassword.otp){
  res.render("user/newpassword",{email})

}else{
  res.render('user/recivedotp',{email,invalid:"Invaid OTP !"})
  console.log('invalid otp');
}


  },

  newpassword:async(req,res)=>{

    const body = req.body
    const email = body.email
const password = body.newpassword
const hash =  await bcrypt.hash(password,10)
if(password===body.cnewpassword){
    
  await UserModel.findOneAndUpdate(
    {email:email},
    {$set:{
      Password:hash
    }}
  )
  
 res.redirect('/login')   


}else{
  res.render('user/newpassword',{email,invalid:"Password does not match !"})
  console.log('Password doesnt match ');
}

  },
  resendOTP:(req,res)=>{
  
    const body = req.body

  const email = body.email
  console.log(email);


  },


  chagepassword:(req,res)=>{
res.render('user/chagepassword')

  },





  
  changedpassword:async(req,res)=>{

const body = req.body

const currenntPass= body.cuttentPass

const secondPass = body.secondpaswword
console.log(secondPass);
const session = req.session.isUser

if(body.firstpassword===secondPass){


  
  const userData = await UserModel.findOne({email:session})
  
  const passwordMatch = await bcrypt.compare(body.currenntPass,userData.Password)
  console.log(passwordMatch);

  if(passwordMatch){
    console.log('hashing');
    const hashPassword = await bcrypt.hash(secondPass,10)

    UserModel.updateOne({email:session},
      {$set:{Password:hashPassword}}).then(()=>{
        req.session.destroy();
       res.redirect('/')  
      
      })

  }else{

    console.log('invalid');
    res.render('user/chagepassword',{invalid:"Invalid Current Password !"})
  }
}else{

  res.render('user/chagepassword',{invalid:"Password Does't Match !"})

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

customer=true

countInCart = ProductData.length


res.render('user/cart',{ProductData,countInCart,sum,profileusername, countInWishlist,customer})

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

      ]) 
   
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
     try{
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

  
      const orderId = orderData._id
      await cart.deleteOne({ userId: userData._id });
      
      if (req.body.paymentMethod === "COD") {
       await order.updateOne({_id:orderId},{$set:{orderStatus:'placed'}})
       
       res.json({ success: true})
       coupon.updateOne(
        {couponName:data.coupon},
        {$push:{users: {userId : objId}}}
       ).then((updated)=>{
      
       })
      
  
  
      }else{
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: productData.map(item => {
               const product= item.productDetail
               
       console.log(productData);
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name:product.product_name,
                },
                unit_amount:product.price * 100,
              },
              quantity: item.quantity,
            }
         
          }),
          success_url:`${process.env.SERVER_URL}/ordersuccess`,
          cancel_url:`${process.env.SERVER_URL}/checkout`,
          })
          res.json({url:session.url})
      }

    }
  } 
}
     }catch(e){
      res.status(500).json({error: e.message})
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

await order.updateOne({ _id:objId}, { $set: { orderStatus: "cancelled" } })
res.redirect('/orderhistory')

},





}



 

