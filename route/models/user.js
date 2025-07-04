const mongoose=require("mongoose")

const users=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    }
})

module.exports=mongoose.model('users',users);