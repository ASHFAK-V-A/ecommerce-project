const mongoose= require('mongoose')
const Schema=mongoose.Schema
const objectId=Schema.objectId

const wishlishtSchema =new Schema({

    userId:{
     type:objectId,
     require:true
    },
    product:{
        type:objectId,
        require:true
    }

}
)

const wishlisht = mongoose.model("wishlist",wishlishtSchema)
module.exports=wishlisht