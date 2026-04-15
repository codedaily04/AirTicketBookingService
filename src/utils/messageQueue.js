const amqplib=require('amqplib');
const {EXCHANGE_NAME, MESSAGE_BROKER_URL}=require('../config/serverConfig');
//This function is used to create a channel and connect to the message broker
const createChannel=async()=>{
    try {
    const connection=await amqplib.connect(MESSAGE_BROKER_URL);
    const channel=await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME,'direct',false);
    return channel;
    } catch (error) {
        console.log(error);
    }
}

//This one is used to get the message from the queue, So basically works as consumer
const subscribeMessage=async (channel,service,binding_key)=>{
    const applicationQueue= await channel.assertQueue('QUEUE_NAME');
    channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);
    channel.consume(applicationQueue.queue, msg=>{
        console.log('Received data');
        console.log(msg.content.toString());
        channel.ack(msg);
    });
}


//This one is used to publish the message, So, it works as producer
const publishMessage=async (channel, binding_key, message)=>{
    try {
        //EXCHANGE_NAME --> Distributors NAME
        await channel.assertQueue('QUEUE_NAME');
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
        console.log('Message published successfully');
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    createChannel,
    subscribeMessage,
    publishMessage
}