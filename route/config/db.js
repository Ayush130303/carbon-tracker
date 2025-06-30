const mongoose=require("mongoose")

const connectDB= async()=>{
    try{
        mongoose.set('strictQuery',false);
        const conn= await mongoose.connect("mongodb://localhost:27017/myDBname'")
        console.log(`mongodb connect succesfully at  ${conn.connection.host}`)
    }
    catch(error){
        console.error(`${error.message}`)
        process.exit(1)
    }
}

module.exports=connectDB