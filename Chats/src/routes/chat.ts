import { Router } from "express";
import chat from "../model/chat.js";
import isAuth from "../middleWare/isAuth.js";
import { createNewChat, getAllChats, sendMessage } from "../controller/chatController.js";



const ChatRoutes= Router();


ChatRoutes.get("/chat/all",isAuth,)
ChatRoutes.post("/newChat",isAuth,createNewChat);
ChatRoutes.get("/allChats",isAuth,getAllChats);
ChatRoutes.post("/message",isAuth,sendMessage);



export default ChatRoutes;