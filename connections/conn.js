const mongoose = require('mongoose')
const session = require('express-session')
const mongoSession=require('connect-mongodb-session') (session)
const mongoURI="mongodb://localhost:27017/UserData"
mongoose
.connect(mongoURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    
}).then((res)=>{
    console.log('mongodb connected');
})

const store = new mongoSession({
    uri:mongoURI,
    collection:'logins'
})

 module.exports=store