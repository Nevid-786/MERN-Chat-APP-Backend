//external package
import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import { ConnectToDB } from "./config/db.js";
import ChatRoutes from "./routes/chat.js";
import cookieParser from "cookie-parser";

//important start
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3003;
app.use(express.json());
app.use(cookieParser());
// app.use(cors)
//important Enda


app.use("/api",ChatRoutes);











ConnectToDB().then(()=>{
    
 app.listen(PORT, () => {
          console.log(
            `Chats Server Started:http://localhost:${process.env.PORT}`,
          );
        });

})


