const express = require('express');
const cors = require('cors'); 
const routes = require('./routes');

//Mongo connection


function connectMongoDB() {
    const mongoose = require('mongoose');
    const mongoDBUrl = 'mongodb://localhost:27017/seu-banco-de-dados'; 
    mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.once('open', () => {
      console.log('Conexão bem-sucedida com o MongoDB!');
    });
  
    db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
  }
  
connectMongoDB();
  


// Express
function expressConnection() {
    const app = express();
    app.use(express.json());
    app.use(routes);
  
    return app;
  }
  
const app = expressConnection();


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});