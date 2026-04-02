import { Document ,model,Schema,Types} from "mongoose";

export interface IMessage extends Document{
    chatId:Types.ObjectId;
    sender:string;
    text?:string;
    image?:{
        url:string,
        publicUrl:string
    }
    messageType:"text"|"image";
    seen:boolean;
    seenAt:Date;
}

const schema = new Schema<IMessage>({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  sender: {
    type: String,
    requred: true,
  },
  text: String,
  image: {
    url: String,
    publicId: String,
  },
  messageType: {
    type: String,
    enum: ["text", "image"],
  },
  seen: {
    type: Boolean,
    default: false,
  },
  seenAt: { type: Date, default: null },
},{
    timestamps:true
});


export default model<IMessage>("Message",schema);