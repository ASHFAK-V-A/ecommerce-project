

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
type:String,
trim:true
},

isBlocked:{
    type:Boolean,
    default:false
},

addressDetails:[
    {
     housename:{
        type:String
     },
     area:{
        type:String
     },
     landmark:{
        type:String
     },
     district:{
        type:String
     },
     postoffice:{
        type:String
     },
     state:{
        type:String
     },
     pin:{
        type:String
     } ,
     houseno:{
      type:String
     }
     
    }
  ],

}



)
module.exports=mongoose.model('user',userSchema)