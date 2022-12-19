
const express=require('express')
const ejs=require('ejs')
const app=express()
const path=require('path')
const mongdb=require('./connections/conn')
const session = require('express-session')
const userRouter=require('./routes/user')
const adminRouter=require('./routes/admin')
const store = require('./connections/conn')
const fileUpload = require('express-fileupload')
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set('views');  


// public file access   
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname,'public'))) 

app.use(express.json());





app.use((req,res,next)=>{
    res.header(
        "Cache-Control",
        "no-cache,privet,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0"
      );
       next();
      })




app.use(session({
   secret:'hellooooo', 
   resave:false,
   saveUninitialized:false,
   
   // store helps to keep session your input days. 
   store:store,
   cookie:{
    maxAge:6000000
     
   }
 

})
 );


 app.use(fileUpload())
 
app.use('/',userRouter)
app.use('/admin',adminRouter)



app.listen(3000,()=>{
    console.log('server is running');
})
