import generateToken from "../config/generateToken.js";
import { publishToQueue } from "../config/RabbitMq.js";
import { getRedisClient } from "../config/Redis.js";
import User from "../model/User.js";
import { TRY_CATCH } from "./Try_Catch.js";

export const postLogin = TRY_CATCH(async (req, res) => {
  const RedisClient =  getRedisClient();

  if (!RedisClient) {
    res.status(400).json({
      message: "Otp Generation Failed",
    });
  }

  //
// console.log("Login Route:",req.body)
  const { email } = req.body;
   const otpKey=`otp:${email}`;
  const otpRateLimitKey=`rateLimitOtp:${email}`


  if (!email) {
    res.json({
      message: "Send Correct Email",
    });
    return ;
  }
   const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({
      message: "No User Found with this Gmail",
    });
  }

 
  const rateLimit=await RedisClient.get(otpRateLimitKey);
  if(rateLimit){
    return res.status(429).json({
        message:"To Many Request Wait for Some Time"

    })
  }

  //otp genartion
const otp =Math.floor(100000+Math.random()*900000).toString();

await RedisClient.set(otpKey,otp,"EX",300);
await RedisClient.set(otpRateLimitKey,"true","EX",60);
  const Message={
    to:email,
    subject:"your OTP code",
    body:`Your Otp is ${otp}. It is valid upto 5 minutes`
  }
 
  await publishToQueue(Message,"sent-otp");
  res.json({
    Message: "Otp sent to Email:"+email+"otp:",otp,
  });
});



//Register User
export const postRegisterUser=TRY_CATCH(async(req,res,next)=>{

  const {name,email}=req.body;
  if(!name||!email){
   return  res.status(400).json({
      message:"Bad Parameter and Request"
    })
  }

  let user = await User.findOne({email:email});
  if(user){
    res.status(403).json({
      message:"Email already registered"
    })
    return
  }

 user=await User.create({
  name,email
})


res.status(201).json({
  message:"User created with email:"+user.email
})


})

export const VerifyUser= TRY_CATCH(async (req, res) => {
  const {otp,email}=req.body;
  if(!otp||!email){
   return  res.status(400).json({
      message:"Bad Parameter and Request"
    })
  }
 

  //otp key imp must be same as post login
   const otpKey=`otp:${email}`;
  const otpRateLimitKey=`rateLimitOtp:${email}`




})