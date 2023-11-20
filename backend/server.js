const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o módulo cors

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar dados JSON
app.use(bodyParser.json());
app.use(cors());

// Caminho do arquivo para armazenar os pedidos
const pedidosFilePath = path.join(__dirname, 'pedidos.json');

if (fs.existsSync(pedidosFilePath))
    fs.unlinkSync(pedidosFilePath);

// Criação do arquivo se não existir
fs.writeFileSync(pedidosFilePath, '[]', 'utf-8');

// Rota para receber pedidos
app.post('/api/pedidos', (req, res) => {
  const orderData = req.body.orderData;
  console.log('Pedido recebido:', orderData);

  // Lê os pedidos existentes do arquivo
  const pedidos = JSON.parse(fs.readFileSync(pedidosFilePath, 'utf-8'));

  // Adiciona o novo pedido
  pedidos.push(orderData);

  // Escreve os pedidos atualizados de volta no arquivo
  fs.writeFileSync(pedidosFilePath, JSON.stringify(pedidos, null, 2), 'utf-8');

  // Envia uma resposta de sucesso
  res.status(200).json({ success: true });
});

// Rota para obter todos os pedidos
app.get('/api/pedidos', (req, res) => {
  // Lê os pedidos do arquivo
  const pedidos = JSON.parse(fs.readFileSync(pedidosFilePath, 'utf-8'));

  // Envia os pedidos como resposta
  res.status(200).json({ pedidos });
});

// Rota SSE para enviar atualizações em tempo real
app.get('/api/sse', (req, res) => {
  // Configura os cabeçalhos para SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Função para enviar dados SSE
  function sendSseData(data) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  // Lê os pedidos do arquivo inicialmente
  const pedidos = JSON.parse(fs.readFileSync(pedidosFilePath, 'utf-8'));

  // Envia os pedidos existentes como primeira mensagem SSE
  sendSseData({ pedidos });

  // Adiciona um listener para atualizações futuras
  const updateListener = (data) => sendSseData(data);
  updateListeners.push(updateListener);

  // Remove o listener quando a conexão é fechada
  req.on('close', () => {
    const index = updateListeners.indexOf(updateListener);
    if (index !== -1) {
      updateListeners.splice(index, 1);
    }
  });
});

// Lista de listeners para atualizações SSE
const updateListeners = [];

// Função para enviar atualizações para todos os clientes SSE
function sendSseUpdate(data) {
  updateListeners.forEach((listener) => listener(data));
}

// Adiciona uma rota para receber pedidos de clientes em tempo real (exemplo)
app.post('/api/realtime-order', (req, res) => {
  const orderData = req.body.orderData;

  // Processa o pedido e armazena os dados
  const pedidos = JSON.parse(fs.readFileSync(pedidosFilePath, 'utf-8'));

  // Adiciona o novo pedido
  pedidos.push(orderData);

  // Escreve os pedidos atualizados de volta no arquivo
  fs.writeFileSync(pedidosFilePath, JSON.stringify(pedidos, null, 2), 'utf-8');

  // Envia uma atualização SSE para todos os clientes
  sendSseUpdate({ pedidos: [orderData] });

  res.status(200).json({ success: true });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Rota para remover um pedido
app.delete('/api/pedidos', (req, res) => {
  const orderData = req.body.orderData;

  // Lê os pedidos do arquivo
  let pedidos = JSON.parse(fs.readFileSync(pedidosFilePath, 'utf-8'));

  pedidos = pedidos.filter(pedido => pedido.numero != orderData.numero);

  fs.writeFileSync(pedidosFilePath, JSON.stringify(pedidos, null, 2), 'utf-8');

  // Envia os pedidos como resposta
  res.status(200);//.json({ pedidos })
});