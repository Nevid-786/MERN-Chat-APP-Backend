
import mongoose from "mongoose";

export const ConnecToDB=async()=>{
const MONGO_URL=process.env.MONGO_URL||null;
try {
    if(!MONGO_URL){
        throw new Error("MONGO URL NOT FOUND")
    }
    await mongoose.connect(MONGO_URL,{
            dbName:"MERN_CHAT_APP_SELF"
        })
    
} catch (error:any) {

    throw new Error(error?.message);
}
}