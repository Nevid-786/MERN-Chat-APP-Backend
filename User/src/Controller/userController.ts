import mongoose, { get } from "mongoose";
import generateToken from "../config/generateToken.js";
import { publishToQueue } from "../config/RabbitMq.js";
import { getRedisClient } from "../config/Redis.js";
import User from "../model/User.js";
import { TRY_CATCH } from "./Try_Catch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";

export const postLogin = TRY_CATCH(async (req, res) => {
 
//  console.log("Login Route:",req.body)
  const RedisClient = getRedisClient();

  if (!RedisClient) {
    res.status(400).json({
      message: "Otp Generation Failed",
    });
  }



  //
  console.log("Login Route:",req.body)
  const { email } = req.body;
  const otpKey = `otp:${email}`;
  const otpRateLimitKey = `rateLimitOtp:${email}`;

  if (!email) {
    res.json({
      message: "Send Correct Email",
    });
    return;
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({
      message: "No User Found with this Gmail",
    });
  }

  const rateLimit = await RedisClient.get(otpRateLimitKey);
  if (rateLimit) {
    return res.status(429).json({
      message: "To Many Request Wait for Some Time",
    });
  }

  //otp genartion
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await RedisClient.set(otpKey, otp, "EX", 300);
  await RedisClient.set(otpRateLimitKey, "true", "EX", 60);
  const Message = {
    to: email,
    subject: "your OTP code",
    body: `Your Otp is ${otp}. It is valid upto 5 minutes`,
  };

  await publishToQueue(Message, "sent-otp");
  res.json({
    Message: "Otp sent to Email:" + email + "otp:",
    otp,
  });
});


//Register User
export const postRegisterUser = TRY_CATCH(async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      message: "Bad Parameter and Request",
    });
  }

  let user = await User.findOne({ email: email });
  if (user) {
    res.status(403).json({
      message: "Email already registered",
    });
    return;
  }

  user = await User.create({
    name,
    email,
  });

  res.status(201).json({
    message: "User created with email:" + user.email,
  });
});

export const VerifyUser = TRY_CATCH(async (req, res) => {
  const RedisClient = getRedisClient();
  console.log("Verify User", req.body);

  if (!RedisClient) {
    res.status(400).json({
      message: "Otp Generation Failed",
    });
  }

  const { otp, email } = req.body;
  if (!otp || !email || email.trim() === "" || otp.trim() === "") {
    return res.status(400).json({
      message: "Bad Parameter and Request",
    });
  }

  //otp key imp must be same as post login
  const otpKey = `otp:${email}`;

  const storedOtp = await RedisClient.get(otpKey);

  if (!storedOtp) {
    return res.status(400).json({
      message: "Expired Otp",
    });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({
      message: "Wrong Otp",
    });
  }

  const user = await User.findOne({ email: email });

  const token = generateToken(user);
  await RedisClient.del(otpKey);
  res
    .status(200)
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
    .json({
      user,
      token: token,
    });
});

export const getMyProfile = TRY_CATCH(
  async (req: AuthenticatedRequest, res) => {
    console.log("user", req.user);
    const user = req.user;
    res.json(user);
  },
);

export const getAllUser = TRY_CATCH(async (req: AuthenticatedRequest, res) => {
  const users = await User.find();
  if (!users) {
    res.json({
      message: "No user Present",
    });
  }

  res.json({
    users: users,
  });
});



export const getUserById = TRY_CATCH(async (req: AuthenticatedRequest, res) => {
try {
  console.log(req.params._id)
   const _id= req.params._id as string;
     if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }
   const user = await User.findOne({ _id: _id });
    if (!user) {
      res.status(400).json({
        message: "No user found",
      });
    }





    
  res.json({user});
} catch (err) {
  console.log(err);
 
  
}

});
