const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o módulo cors

// Configuração do body parser para interpretar JSON
const app = express();
const port = 3000;

// Use o middleware cors
app.use(cors());

// Middleware para analisar corpos JSON
app.use(bodyParser.json());

let pedidos = [];

// Rota para receber pedidos da tela principal
app.post('/api/pedidos', (req, res) => {
    const orderData = req.body;

    // Aqui, você pode processar o pedido e realizar ações necessárias na cozinha
    pedidos.push(orderData);
    
    console.log('Pedido recebido:', orderData);

    res.json({ mensagem: 'Pedido recebido com sucesso!' });
    // res.status(200).json({ success: true });
});

app.get('/api/pedidos', (req, res) => {
    // const pedido = req.body;

    // Aqui, você pode processar o pedido e realizar ações necessárias na cozinha
    // let orderData = pedidos.pop();
    // console.log('Retornando pedidos:', orderData);
    res.status(200).json(pedidos.pop());
    // res.json(orderData);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Rota SSE
app.get('/sse', (req, res) => {
    // Configuração dos cabeçalhos para Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    // Envie uma mensagem a cada 5 segundos
    const intervalId = setInterval(() => {
      res.write(`data: ${JSON.stringify({ message: 'Pedido pronto!' })}\n\n`);
    }, 5000);
  
    // Encerre a conexão após 10 minutos (outras opções podem ser consideradas)
    setTimeout(() => {
      clearInterval(intervalId);
      res.end();
    }, 600000); // 10 minutos
  
    // Mantenha a conexão aberta
    req.on('close', () => {
      clearInterval(intervalId);
    });
  });