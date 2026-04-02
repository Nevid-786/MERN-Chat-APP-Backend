import axios from "axios";
import type { AuthenticatedRequest } from "../middleWare/isAuth.js";
import chat from "../model/chat.js";
import { TRY_CATCH } from "./Try_Catch.js";
import Message from "../model/Message.js";
import mongoose from "mongoose";

export const createNewChat = TRY_CATCH(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { otherUserId } = req.body;
    if (otherUserId === userId)
      return res.status(403).json({ message: "Invalid chat request " });
    if (!otherUserId)
      return res
        .status(401)
        .json({ message: "No user Found With User Id:" + otherUserId });
    const existingChat = await chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });
    if (existingChat) {
      return res.json({
        message: "Chat Already Exists",
        chatId: existingChat._id,
      });
    }
    const newChat = await chat.create({
      users: [userId, otherUserId],
    });
    res.json({
      message: "new Chat Created",
      chatId: newChat._id,
    });
  },
);

export const getAllChats = TRY_CATCH(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = req.cookies.accessToken;
  console.log("userID:", userId);
  const Chats = await chat.find({
    users: { $all: [userId] },
  });
  // console.log("chats",Chats)
  const chats_With_OtherUserData_Promise = Chats.map(async (chat) => {
    const otherUserId = chat.users.filter((id) => id !== userId)[0];
    console.log(otherUserId);
    try {
      const { data } = await axios.get(
        `${process.env.USER_SERVICE}/api/user/${otherUserId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);

      const unseenCount = await Message.countDocuments({
        _id: chat._id,
        seen: false,
        sender: { $ne: userId },
      });

      if (!data.user) {
        return "no data for user id" + otherUserId;
      }

      return {
        _id: chat._id,
        otherUser: data.user,
        chat: {
          ...chat.toObject(),
          unseenCount: unseenCount || 0,
        },
      };
    } catch (error) {
      console.error(
        "Error fetching other user data:",
        error || "no user data while getting other user data",
      );
    }
  });

  const ChatsWithUserData = await Promise.all(chats_With_OtherUserData_Promise);

  res.json({
    chats: ChatsWithUserData,
  });
});

export const sendMessage = TRY_CATCH(async (req: AuthenticatedRequest, res) => {
  const senderId = req.user?._id;
    const { text, chatId } = req.body;
  
  if (!senderId) {
    return res.status(401).json({ message: "Unauthorized" });
  }


 if (!mongoose.Types.ObjectId.isValid(senderId) ||!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({
      message: "Invalid MONGO Document(chatId||sender ID) ID",
    });
  }




  // const imageFile=req.file;
  if (!text) {
    return res.status(400).json({
      message: "atleast there must be text or image",
    });
  }

  const Chat = await chat.findById(chatId);
  if (!Chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const isSenderInchat = Chat.users.includes(senderId);
  if (!isSenderInchat) {
    return res.status(403).json({
      message: "you are not participant of this chat",
    });
  }
  let latestMessagetext = text;

  let messageData:any = {
    chatId:chatId,
    sender: senderId,
    messageType: "text",
  };

  // if(imageFile){
  //     messageData.messageType="image"
  // latestMessagetext="image";
  // }else{}

    messageData.text=text;

  const message = await Message.create(messageData);

  const updatedChat = await chat.findByIdAndUpdate(
    chatId,
    {
      latestMessage:{
        text:latestMessagetext,
        sender:senderId
      },
      updateAt:new Date()
    },
    {
      new: true,
    },
  );
res.json({
    message:message,senderId

})





});
