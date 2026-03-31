//external package
import express from "express";
import dotenv from "dotenv";
import { connectToRabbitMq } from "./Consumer.js";

//important start
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3002;
app.use(express.json());
// app.use(cors)
//important End



connectToRabbitMq().then(()=>{
    console.log("Connected To rabbit MQ")
})

 app.listen(PORT, () => {
          console.log(
            `User Server Started:http://localhost:${process.env.PORT}`,
          );
        });





