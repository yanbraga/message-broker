const express = require("express");
const router = express.Router();
const contactDB = require("./model/mongoDB");
const controllerBroker = require("./controller/controller_broker");




//send to rabbit
router.get("/start", async (req, res) => {
  console.log("Teste controller");
  controllerBroker.postUsersOnQueue().then(() => {
    res.send({ response: "Todos os contatos enviados para fila" });
  }).catch((error) => {
    console.error('Erro ao enviar contatos para fila:', error);
    res.status(500).send({ error: 'Erro ao enviar contatos para fila' });
  });
});

//get rabbit info

router.get("/start/rabbit", async (req, res) => {
  try {
    // Chame a função getUsersFromQueue dentro da rota
    await controllerBroker.getUsersFromQueue();
    res.status(200).send("Processo de obtenção de contatos da fila iniciado.");
  } catch (error) {
    console.error("Ocorreu um erro na rota:", error);
    res.status(500).send("Ocorreu um erro na rota.");
  }
});

module.exports = router;
