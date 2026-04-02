import type { NextFunction,Response,Request} from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"


export interface AuthenticatedRequest extends Request {
    user?: {
        _id:string;
       name:string;
        email: string;
    };
}


const isAuth=(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const accesstoken= req.cookies.accessToken;
    // console.log(accesstoken);
    const authHeader= req.headers.authorization||`Bearer ${accesstoken}`||null;
    try {
        if(!authHeader || !authHeader?.startsWith("Bearer")){
           throw new Error("no Token found Please Login");

        }
        const token =authHeader.split(" ")[1];
        console.log(token);

         const decodedValue:any=jwt.verify(token as string,
                  process.env.JWT_SECRET as string
            ) as JwtPayload;
            //    console.log(decodedValue);
if(!decodedValue){
    throw new Error("Invalid Token");
}
           console.log(decodedValue)
req.user=decodedValue
next();

    } catch (error) {
        res.status(403).json({message:(error as Error).message});
        
    }
}

export default isAuth;