import { Document ,Schema} from "mongoose";

export interface IChat extends Document{
users:string[];
latestMessage:{
    text:string;
    sender:string;
}

}



const schema= new Schema<IChat>({
    users:[{
        type:String,

    }],
    latestMessage:{
    text:{String},
    sender:{String}
}
}
,{
    timestamps:true
})