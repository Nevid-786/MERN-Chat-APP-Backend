import amqp from "amqplib"
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
    process.exit(1);
}

  } catch (error) {
    process.exit(1);
  }
}

export const publishToQueue=async (message:any,queueName:string)=>{
    if(!Channel){
console.log("Rabbit mq channel not init:");
return;
}

    await Channel.assertQueue(queueName,{durable:true});
    console.log("Queue Created:",queueName)
 Channel.sendToQueue(queueName,Buffer.from(JSON.stringify(message)),{persistent:true})
}