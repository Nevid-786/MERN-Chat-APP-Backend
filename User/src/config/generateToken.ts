
import type { IUser } from "../model/User.js";
import jwt from "jsonwebtoken"

function generateToken(user:any){
    const Secret= process.env.JWT_SECRET;
    if(!Secret){
        console.log("No JWT Secret")
    }
    return jwt.sign(
        { _id: user._id, email: user.email,name:user.name },
        Secret as string,
        {expiresIn:"1h"}
       
    )


}
export default generateToken;