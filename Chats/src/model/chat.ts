import { Document ,Schema} from "mongoose";

export interface IChat extends Document{
users:string[];
latestMessage:{
    text:string;
    sender:string;
}

}