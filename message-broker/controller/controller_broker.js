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
  const rabbitMQUrl = "amqp://localhost:15672"; // URL do RabbitMQ

  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName);

    // Loop para obter e processar todas as mensagens na fila
    while (true) {
      const message = await channel.get(queueName);

      if (!message) {
        // Não há mais mensagens na fila
        break;
      }

      

      // Aqui você pode inserir a lógica para salvar 'contato' no banco de dados
      // Substitua esta linha pela lógica de salvamento no banco de dados

      async function salvarContatoNoDB(contato) {
        try {
          // Crie uma instância do modelo Contato com os dados do contato
          const novoContato = new db({
            nome: db.nome,
            email: db.email,
            // Outros campos do modelo Contato
          });
      
          // Salve o contato no banco de dados
          await novoContato.save();
      
          console.log('Contato salvo no banco de dados:', novoContato);
        } catch (error) {
          console.error('Erro ao salvar o contato no banco de dados:', error);
        }
      }
      
      const contato = JSON.parse(message.content.toString());

      // Marcar a mensagem como processada
      await channel.ack(message);

      await salvarContatoNoDB(contato);

    }

    // Fecha a conexão com o RabbitMQ
    await channel.close();
    await connection.close();

    console.log("Todos os contatos da fila foram processados e salvos no banco de dados.");
  } catch (error) {
    console.error("Ocorreu um erro:", error);
  }
  
}

module.exports = {
  postUsersOnQueue,
  getUsersFromQueue
};
