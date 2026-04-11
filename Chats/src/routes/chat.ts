import { Router } from "express";
import chat from "../model/chat.js";
import isAuth from "../middleWare/isAuth.js";
import { createNewChat, getAllChats, getMessagesbyChatId, sendMessage } from "../controller/chatController.js";
import { cloudUpload } from "../middleWare/multer.js";



const ChatRoutes= Router();


ChatRoutes.get("/chat/all",isAuth,)
ChatRoutes.post("/newChat",isAuth,createNewChat);
ChatRoutes.get("/allChats",isAuth,getAllChats);
ChatRoutes.post("/message",isAuth,cloudUpload.single("file"),sendMessage);
ChatRoutes.get("/messages/chat/:id",isAuth,getMessagesbyChatId);
// ChatRoutes.get("/messages",isAuth,getMessages);



export default ChatRoutes;