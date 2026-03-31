
import type { IUser } from "../model/User.js";
import jwt from "jsonwebtoken"

function generateToken(user:any){
    const Secret= process.env.JWT_SECRET;
    if(!Secret){
        console.log("No JWT Secret")
    }
    return jwt.sign(
        user,
        Secret as string,
        {expiresIn:"1h"}
       
    )


}
export default generateToken;