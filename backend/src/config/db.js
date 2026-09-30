import mongoose from 'mongoose'

export const connectDB = async()=>{

    const MONGODB_URL = process.env.MONGODB_URL 

    if(!MONGODB_URL){
        console.log("❌ Error : MONGODB_URL not define in .env file ")
        return
    }
try {
    const res =  await mongoose.connect(`${MONGODB_URL}`)
    console.log("✅ MongoDB connect Sucessfully ");
    
    
} catch (error) {
    console.log("❌ error in mongoDB connection", error);
}
}

