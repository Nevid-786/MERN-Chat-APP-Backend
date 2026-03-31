import { Router } from "express";
import { getAllUser, getMyProfile, getUserById, postLogin, postRegisterUser, VerifyUser } from "../Controller/userController.js";
import isAuth from "../middleware/isAuth.js";


const userRouter=Router();


userRouter.post("/login",postLogin);
userRouter.post("/register",postRegisterUser);
userRouter.post("/verify",VerifyUser);
userRouter.get("/me",isAuth,getMyProfile);
userRouter.get("/getalluser",isAuth,getAllUser);
userRouter.get("/user/:_id",isAuth,getUserById);


export default userRouter;