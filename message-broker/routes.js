const express = require('express');
const router = express.Router();
const Contato = require('./model/mongoDB');


// rota teste
router.get('/teste/contatos/', async (req, res) => {
    try {
      // Use o modelo Contato e o método find() para buscar todos os contatos no banco de dados.
      const contatos = await Contato.find().limit(1).exec();
  
      if (!contatos || contatos.length === 0) {
        res.status(404).json({ message: 'Nenhum contato encontrado' });
      } else {
        res.json(contatos);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar os contatos', error });
    }
});


router.get('/start', async(req, res) => {



});



  module.exports = router;
