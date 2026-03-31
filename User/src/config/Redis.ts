import {Redis} from "ioredis"
import dotenv from "dotenv"
dotenv.config();
const Redis_url=process.env.Redis_URL;

let client:Redis;
if(!Redis_url){
    console.log("No Redis URL Found");
    process.exit(1);
}

export const ConnectRedisClient=async()=>{
try {
    client = new Redis(Redis_url);
    
} catch (error) {
    throw new Error("Redis Not Connected")
    
}

}


export const getRedisClient=():Redis=>{
    if(!client){
        throw new Error("No Redis Client Found");
        
    }
    return client;
}
