import { Schema,Document } from "mongoose";
import mongoose from "mongoose";


export interface IUser extends Document{
    email:string;
    name:string;
    createdAt:string;
    updatedAt:string;
}

const schema=new Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{type:String,required:true,unique:true}

},
{
    timestamps:true
})

export default  mongoose.model<IUser>("User",schema);