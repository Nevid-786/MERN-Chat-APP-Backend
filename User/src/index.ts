//external package
import express from "express";
import dotenv from "dotenv";
import { ConnecToDB } from "./config/db.js";
import { ConnectRedisClient } from "./config/Redis.js";
import { connectToRabbitMq } from "./config/RabbitMq.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";


//important start
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://10.56.196.193:5173"
  ],
  credentials: true
}));
//important End















app.post("/api/user",(req,res,n)=>{
    console.log(req.body);
    res.send("hello")
})
app.use("/api",userRouter);



app.use("/", (req, res) => {
  res.json({
    Message: "server Started",
  });
});



connectToRabbitMq().then(()=>{
    console.log("RabbitMq connected")
})
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
});


ConnectRedisClient()
  .then(() => {
    ConnecToDB()
      .then(() => {
        console.log("Mongo connected");
        app.listen(PORT, () => {
          console.log(
            `User Server Started:http://localhost:${process.env.PORT}`,
          );
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
    console.log("Redis connected");
  })
  .catch((error) => {
    console.log("Error:", error.message);
  });
