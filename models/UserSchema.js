

const mongoose =require("mongoose")



const userSchema= new mongoose. Schema({
   
username:{
    type:String,
    required:true,
    
    trim: true
},
email:{
    type:String,
    unique:true,
    trim: true
},
Password:{
    type:String,
    required:true,
    trim:true

},

phone:{
type:Number,
trim:true
},

isBlocked:{
    type:Boolean,
    default:false
}

}

)
module.exports=mongoose.model('user',userSchema)