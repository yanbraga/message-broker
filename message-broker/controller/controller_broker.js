const db = require("../model/mongoDB");
const amqp = require("amqplib"); // Importe a biblioteca amqplib
const axios = require('axios');
const rabbot = require('rabbot');
const mongoose = require('mongoose');




async function postUsersOnQueue() {
  const allContacts = await db.contactDB.find().exec();
  const contactList = [];
  // Conecte-se ao servidor RabbitMQ
  const connection = await amqp.connect("amqp://localhost");

  // Channel Rabbit
  const channel = await connection.createChannel();

  const queueName = "Contacts_DEV";
  await channel.assertQueue(queueName, { transient: true });

  for (const c of allContacts) {
    contactList.push(c);

    //Send to Queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(c)));
  }

  console.log("Total de Contatos: ", contactList.length);
}


async function getUsersFromQueue() {

  const queueName = "Contacts_DEV"; // Nome da fila RabbitMQ
  const rabbitMQUrl = "amqp://localhost"; // URL do RabbitMQ

  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName);

    await channel.consume(queueName, (message) => {
      console.log( JSON.parse(message.content.toString()));
      channel.ack(message);
    });

    // await channel.close();
    // await connection.close();

    console.log("Todos os contatos da fila foram processados e salvos no banco de dados.");
  } catch (error) {
    console.error("Ocorreu um erro:", error);
  }
  
}

module.exports = {
  postUsersOnQueue,
  getUsersFromQueue
};
