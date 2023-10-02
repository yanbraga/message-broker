const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    id: { type: String },
    codigo: { type: String },
    nome: { type: String },
    fantasia: { type: String },
    tipo: { type: String },
    cnpj: { type: String },
    ie_rg: { type: String },
    endereco: { type: String },
    numero: { type: String },
    bairro: { type: String },
    cep: { type: String },
    cidade: { type: String },
    complemento: { type: String },
    uf: { type: String },
    fone: { type: String },
    email: { type: String },
    situacao: { type: String },
    contribuinte: { type: String },
    site: { type: String },
    celular: { type: String },
    dataAlteracao: { type: String },
    dataInclusao: { type: String },
    sexo: { type: String },
    clienteDesde: { type: String },
    dataNascimento: { type: String },
    tiposcontact: [
      {
        tipocontact: {
          descricao: { type: String }
        }
      }
    ]
});

const contactDB = mongoose.model('Contato', contactSchema);

module.exports = contactDB;