import type { NextFunction,Response,Request} from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"

interface AuthenticatedRequest extends Request {
    user?: {
        _id:string;
       name:string;
        email: string;
    };
}

const isAuth=(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const authHeader= req.headers.authorization||null;
    try {
        if(!authHeader || !authHeader?.startsWith("Bearer")){
           throw new Error("no Token found Please Login");

        }
        const token =authHeader.split(" ")[1];

         const decodedValue=jwt.verify(token as string,
                  process.env.JWT_SECRET as string
            ) as JwtPayload;
if(!decodedValue){
    throw new Error("Invalid Token");
}
           
req.user=decodedValue.user;


    } catch (error) {
        res.status(403).json({message:(error as Error).message});
        
    }
}

export default isAuth;