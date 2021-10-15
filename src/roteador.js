const express = require("express");
const controladorContas = require("./controlador");
const roteador = express();

roteador.get("/contas", controladorContas.consultarTodasAsContas); 
roteador.post("/contas",controladorContas.criarConta); 
roteador.put("/contas/:numeroConta/usuario", controladorContas.atualizarUsuarioConta);
roteador.delete("/contas/:numeroConta", controladorContas.excluirConta);
roteador.post("/transacoes/depositar", controladorContas.depositar);
roteador.post("/transacoes/sacar", controladorContas.sacar);
roteador.post("/transacoes/transferir", controladorContas.transferir);
roteador.get("/contas/saldo", controladorContas.saldo);
roteador.get("/contas/extrato", controladorContas.extrato);

module.exports = roteador;