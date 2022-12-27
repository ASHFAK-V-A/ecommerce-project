const nodemailer=require('nodemailer')
require('dotenv').config()

module.exports={
   mailTransporter: nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
      }
   }),
   
}