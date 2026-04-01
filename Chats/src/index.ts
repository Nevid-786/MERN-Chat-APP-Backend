//external package
import express from "express";
import dotenv from "dotenv";

//important start
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3003;
app.use(express.json());
// app.use(cors)
//important Enda




 app.listen(PORT, () => {
          console.log(
            `Chats Server Started:http://localhost:${process.env.PORT}`,
          );
        });





