const bancodedados = require("./bancodedados");
const { format } = require('date-fns');
let numeroConta = 1;

function consultarTodasAsContas(req, res){
    if(req.query.senha_banco === ""){
        res.status(400);
        res.json({erro: "Você não digitou a senha"});
        return;
    }       
    if(req.query.senha_banco !== bancodedados.banco.senha){
        res.status(400);
        res.json({ erro: "Sua senha está inválida"});
        return;
    }    
    res.send(bancodedados.contas);   
}

function criarConta(req, res){
    if(req.body.saldo !== 0){
        res.status(400);
        res.json({erro: "O saldo tem que ser 0"});
        return;
    }  
    if(!req.body.usuario.nome){
        res.status(400);
        res.json({erro: "Você precisa digitar o nome"});
       return;
   }
   if(!req.body.usuario.cpf){
        res.status(400);
        res.send({erro: "Você precisa digitar o CPF"});
        return;
   }
   if(!req.body.usuario.telefone){
        res.status(400);
        res.send({erro: "Você precisa digitar o telefone"});
        return;
    }
    if(!req.body.usuario.email){
        res.status(400);
        res.send({erro:"Você precisa digitar o email"});
        return;
    }
    if(!req.body.usuario.senha){
        res.status(400);
        res.json({erro: "Você precisa digitar uma senha"});
        return;
    }
    const validarCpf = bancodedados.contas.find((buscar) => buscar.usuario.cpf === req.body.usuario.cpf);
    if(validarCpf){
        res.status(400);
        res.json({erro: "Este CPF já existe"});
        return;
    }    
    const validarEmail = bancodedados.contas.find((buscar) => buscar.usuario.email === req.body.usuario.email);
    if(validarEmail){
        res.status(400);
        res.json({erro: "Este E-mail já existe"});
        return;
    }    
    const novaConta = {
        numero: numeroConta,
        saldo: req.body.saldo,
        usuario: req.body.usuario
    };    
    bancodedados.contas.push(novaConta);      
    numeroConta += 1;
    res.status(201);
    res.json(novaConta); 
}

function atualizarUsuarioConta(req, res){
    const contaAlterar = bancodedados.contas.find((alterar) => alterar.numero === Number(req.params.numeroConta));
    
    if(!contaAlterar){
        res.status(400);
        res.json({erro: "Conta inválida"});
        return;
    }
     let val = false;   
    if(req.body.nome !== undefined){
        contaAlterar.usuario.nome = req.body.nome;
        val = true;
    }

    const validarCpf = bancodedados.contas.find((buscar) => buscar.usuario.cpf === req.body.cpf);
    if(validarCpf){
        res.status(400);
        res.json({erro: "Este CPF já existe"});
        return;
    }
    if(req.body.cpf !== undefined){
        contaAlterar.usuario.cpf = req.body.cpf;
        val = true;
    }

    if(req.body.data_nascimento !== undefined){
        contaAlterar.usuario.data_nascimento = req.body.data_nascimento;
        val = true;
    }
    if(req.body.telefone !== undefined){
        contaAlterar.usuario.telefone = req.body.telefone;
        val = true;
    }

    const validarEmail = bancodedados.contas.find((buscar) => buscar.usuario.email === req.body.email);
    if(validarEmail){
        res.status(400);
        res.json({erro: "Este E-mail já existe"});
        return;
    }    
    if(req.body.email !== undefined){
        contaAlterar.usuario.email = req.body.email;
        val = true;
    }
    if(req.body.senha !== undefined){
        contaAlterar.usuario.senha = req.body.senha;
        val = true;
    }
    if(val === false){
        res.status(401);
        res.json({erro: "Não foi informado od dados para a lteração."})
    }  
    res.json({erro: "Conta atualizada."});    
}

function excluirConta(req, res){
    const contaDeletar = bancodedados.contas.find((deletar) => deletar.numero === Number(req.params.numeroConta));
    if(!contaDeletar){
        res.status(400);
        res.json({erro: "Conta inválida"});
        return;
    }
    if(contaDeletar.saldo !== 0){
        res.status(401);
        res.json({erro: "Conta com saldo, favor zerar" });
        return;
    }
    const indice = bancodedados.contas.indexOf(contaDeletar);
    bancodedados.contas.splice(indice,1);       
    res.json({erro: "conta excluída com sucesso!."}); 
}

function depositar(req, res){
    const contaBuscar = bancodedados.contas.find((buscar) => buscar.numero === req.body.numero);
    if(!contaBuscar){
        res.status(400);
        res.json({erro: "Conta inválida"});
        return;
    }
    if(!req.body.numero){
        res.status(400);
        res.json({erro: "Você precisa digitar o numero da conta."});
        return;
    }  
    if(req.body.valor_deposito <= 0){
        res.status(400);
        res.json({erro: "O valor do depósito tem ser maior 0."});
        return;
    }    
    if(!req.body.valor_deposito){
        res.status(400);
        res.json({erro: "Você precisa digitar o valor do deposito."});
        return;
    }
    contaBuscar.saldo += req.body.valor_deposito;
    const date = new Date();
    const dateFormat = format(date, "yyyy-MM-dd' 'HH:mm:ss")
    const novoDeposito = {
        data: dateFormat,
        numero: contaBuscar.numero,
        valor: req.body.valor_deposito
    };    
    bancodedados.depositos.push(novoDeposito);      
    res.json({mensagem:"Deposito realizado com sucesso"});
}

function sacar(req, res){
    const contaBuscar = bancodedados.contas.find((buscar) => buscar.numero === req.body.numero);
    console.log(contaBuscar);
    if(!req.body.numero){
        res.status(400);
        res.json({erro: "Você precisa digitar o numero da conta."});
        return;
    }  
    if(!contaBuscar){
        res.status(400);
        res.json({erro: "Conta inválida"});
        return;
    }
    if(!req.body.senha){
        res.status(400);
        res.json({erro: "Você precisa digitar a senha."});
        return;
    }
    if(req.body.valor_saque <= 0){
        res.status(400);
        res.json({erro: "Valor de saque inválido."});
        return;
    }  
    if(!req.body.valor_saque){
        res.status(400);
        res.json({erro: "Você precisa digitar o valor do saque."});
        return;
    }
    if(req.body.senha !== contaBuscar.usuario.senha){
        res.status(400);
        res.json({erro: "A senha está errada."});
        return;
    }
    if(req.body.valor_saque > contaBuscar.saldo){
        res.status(400);
        res.json({erro: "Você não tem saldo suficiente."});
        return;
    }    
    contaBuscar.saldo -= req.body.valor_saque;
    const date = new Date();
    const dateFormat = format(date, "yyyy-MM-dd' 'HH:mm:ss")
    const novoSaque = {
        data: dateFormat,
        numero: contaBuscar.numero,
        valor: req.body.valor_saque
    };    
    bancodedados.saques.push(novoSaque);      
    res.json({mensagem:"Saque realizado com sucesso"});

}


function transferir(req, res){
    const contaOrigemBuscar = bancodedados.contas.find((buscar) => buscar.numero === req.body.numero_conta_origem);
    const contaDestinoBuscar = bancodedados.contas.find((buscar) => buscar.numero === req.body.numero_conta_destino);
    if(!req.body.numero_conta_origem){
        res.status(400);
        res.json({erro: "Você precisa digitar o numero da conta de origem."});
        return;
    }  
    if(!req.body.senha){
        res.status(400);
        res.json({erro: "Você precisa digitar a senha."});
        return;
    }
    if(req.body.valor_transferir <= 0){
        res.status(400);
        res.json({erro: "Valor de saque inválido."});
        return;
    }  
    if(!req.body.valor_transferir){
        res.status(400);
        res.json({erro: "Você precisa digitar o valor da transferência."});
        return;
    }
    if(!req.body.numero_conta_destino){
        res.status(400);
        res.json({erro: "Você precisa digitar o numero da conta de destino."});
        return;
    }        
    if(!contaOrigemBuscar){
        res.status(400);
        res.json({erro: "Conta de origem inválida"});
        return;
    }
    if(!contaDestinoBuscar){
        res.status(400);
        res.json({erro: "Conta de destino inválida"});
        return;
    }   
    if(req.body.senha !== contaOrigemBuscar.usuario.senha){
        res.status(400);
        res.json({erro: "A senha está errada."});
        return;
    }
    if(req.body.valor_transferir > contaOrigemBuscar.saldo){
        res.status(400);
        res.json({erro: "Você não tem saldo suficiente."});
        return;
    }     
    contaOrigemBuscar.saldo -= req.body.valor_transferir;
    contaDestinoBuscar.saldo += req.body.valor_transferir; 
    const date = new Date();
    const dateFormat = format(date, "yyyy-MM-dd' 'HH:mm:ss");   
    const novaTransferencia = {        
        data: dateFormat,
        numero_conta_origem: contaOrigemBuscar.numero,
        numero_conta_destino: contaDestinoBuscar.numero,
        valor: req.body.valor_transferir
    };
    bancodedados.transferencias.push(novaTransferencia);      
    console.log(bancodedados.transferencias);    
    res.json({mensagem:"Transferência realizado com sucesso"});

}

function saldo(req, res){
    const contaBuscar = bancodedados.contas.find((buscar) => buscar.numero === Number(req.query.numero_conta));
    if(req.query.numero_conta === undefined  ||  req.query.senha === undefined){
        res.status(400);
        res.json({erro: "Digite o numero da conta e a senha."});
        return;
    }    
    if(!contaBuscar){ 
        res.status(400);
        res.json({erro: "Conta inválida."});
        return;
    }
    if(contaBuscar.usuario.senha !== Number(req.query.senha)){
        res.status(400);
        res.json({erro: "Senha inválida"});
        return;
    }
    res.json({ mensagem: `O saldo da conta numero (${contaBuscar.numero}) é R$ ${contaBuscar.saldo}`});
}

function extrato(req, res){
    const contaBuscar = bancodedados.contas.find((buscar) => buscar.numero === Number(req.query.numero_conta));
    if(req.query.numero_conta === undefined  ||  req.query.senha === undefined){
        res.status(400);
        res.json({erro: "Digite o numero da conta e a senha."});
        return;
    }    
    if(!contaBuscar){ 
        res.status(400);
        res.json({erro: "Conta inválida."});
        return;
    }
    if(contaBuscar.usuario.senha !== Number(req.query.senha)){
        res.status(400);
        res.json({erro: "Senha inválida"});
        return;
    }
    const extratoDepositos = bancodedados.depositos.filter((x) => { return x.numero === contaBuscar.numero });
    const extratoSaques = bancodedados.saques.filter((x) => { return x.numero === contaBuscar.numero });
    const extratoTransEnviadas = bancodedados.transferencias.filter((x) => { return x.numero_conta_origem === contaBuscar.numero });
    const extratoTransRecebidas = bancodedados.transferencias.filter((x) => { return x.numero_conta_destino === contaBuscar.numero });
    
    res.json({depositos: extratoDepositos, saques: extratoSaques, transferenciasEnviadas: extratoTransEnviadas, transferenciasRecebidas: extratoTransRecebidas });
}

module.exports = {consultarTodasAsContas, criarConta,atualizarUsuarioConta, excluirConta, depositar, sacar, transferir, saldo, extrato};