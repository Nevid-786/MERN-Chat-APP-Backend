import { Router } from "express";
import { postLogin, postRegisterUser } from "../Controller/userController.js";


const userRouter=Router();


userRouter.post("/login",postLogin);
userRouter.post("/register",postRegisterUser);


export default userRouter;