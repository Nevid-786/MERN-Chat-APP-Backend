//external package
import express from "express";
import dotenv from "dotenv";
import { ConnecToDB } from "./config/db.js";
import { ConnectRedisClient } from "./config/Redis.js";
import { connectToRabbitMq } from "./config/RabbitMq.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";


//important start
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser())


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
