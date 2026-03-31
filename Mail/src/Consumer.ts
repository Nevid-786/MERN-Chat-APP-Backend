import amqp from "amqplib"
import { json } from "express";
import nodemailer from "nodemailer"
let Channel:amqp.Channel;
export const  connectToRabbitMq=async ()=>{
  try {
      const connection = await amqp.connect({
          protocol:"amqp",
          hostname:process.env.Rabbitmq_Host,
          port:5672,
          username:process.env.Rabbitmq_Username,
          password:process.env.Rabbitmq_Password
      })
 Channel = await connection.createChannel();
if(!Channel){
    throw new Error("Channel not created")  
}

await Channel.assertQueue("sent-otp",{durable:true});

Channel.consume("sent-otp",async (data:any)=>{
     try {
        const {to,subject,body}=JSON.parse(data.content.toString());
        
        const transporter=nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            auth:{
                user:process.env.USER,
                pass:process.env.PASSWORD
            }
        })
         const info =await transporter.sendMail({
            from:"Chat app",
            to,
            subject,
        html:body
        })
        if(info.accepted.includes(to)){
          Channel.ack(data);//if message sent ack 

          console.log("Otp sent to :",to)
        }
        else{
          Channel.nack(data,false,true);//retry the mail
        }
        // Channel.ack(data);
        // console.log("Otp Sent",info)
    } catch (error) {
        console.log("Fail to send OTP",error)
        
    }

})



  } catch (error:any) {
    console.log(error?.message)

  }
}

