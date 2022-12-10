
const UserModel = require('../models/UserSchema')
const bcrypt = require('bcrypt');
const emailregex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const PasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const Products = require('../models/ProductSchema')
require('dotenv').config()
const mailer=require('../midlweare/otpvalidation')
const cart=require('../models/CartSchema')
const mongoose = require('mongoose')




let name
let email
let Password
let phone


async function emailExists(email) {
  const userfound = await UserModel.findOne({ email: email })
  if (userfound) {
    return true;
  } else {
    return false;
  }
}



module.exports = {

  getHome: async (req, res) => {
    
    const product = await Products.find({delete:false})

    if (req.session.isUser) {
      customer = true
      
      res.render('user/home', { product })
    } else {
      customer = false
      res.render('user/home', { product })
    }

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
                    phone=req.body.num,
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

    // Product Id
    const prodid=req.params.id

    // User Id
    let session=req.session.isUser

    // product id conver to object model
    const objId = mongoose.Types.ObjectId(prodid)


let proObj = {
productId : objId,

  };

  const UserData= await UserModel.findOne({email:session})
  const userCart = await cart.findOne({userId :UserData._id})

    if(userCart){
 
      let proExist =userCart.product.findIndex(
      (product) =>product.productId== prodid
      )
console.log(proExist);

    if(proExist !=-1){
  await cart.aggregate([
     {
      $unwind :"$product"
     }
   ])
 }

   




    // if(proExist !=-1){
    //   await cart.aggregate([
    //     {
    //       $unwind: "$product"
    //     }
    //   ])
    //   await cart.updateOne(
    //     {userId:UserData._id, "product.productId":objId},
    //     {$inc :{"product.$.quantity ":1}}
    //   )
    //   res.redirect('/cart')
    // }else{
    //   cart
    //      .updateOne({userId:UserData._id},{$push: {product:proObj}})
    //      .then(()=>{
    //       res.redirect('/viewcart')
    //      })
    // }


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
        res.render('user/cart')
        console.log(newCart);
      })
      
      
    }

  

  },
  

  

viewcart: async(req,res)=>{

},











  viewproduct:async(req,res)=>{
      const id =req.params.id
    const products = await Products.findOne({_id:id})
    res.render('user/viewproduct',{products})
    
    
  }




}


// muhammadarshad8935@gmail.com

  //password 
  //af10ashfak#ii            