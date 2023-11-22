const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { kv } = require("@vercel/kv");
// const { v4: uuidv4 } = require('ulid');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

// Middleware para processar dados JSON
app.use(bodyParser.json());
app.use(cors());

// Store connectionIds for SSE clients

const connections = new Set();
// Lista de listeners para atualizações SSE
const updateListeners = [];

// Função para enviar atualizações para todos os clientes SSE
function sendSseUpdate(data) {
  updateListeners.forEach((listener) => listener(data));
}

app.get('/', async (req, res) => {
    res.send('Hello World')
})

// Rota para receber pedidos
app.post('/api/pedidos', async(req, res) => {
    const orderData = req.body.orderData;

    // Lê os pedidos existentes do arquivo
    // const pedidos = await readBlobStorageContent();

    // Adiciona o novo pedido
    // pedidos.push(orderData);
    // let number = await kv.append(pedido.numero, pedido.itens);
    sendSseUpdate({ pedidos: [orderData] });

  // Update data for each connected client
    for (const connectionId of connections) {
        // await kv.put(`data_${connectionId}`, JSON.stringify(orderData));
        let saved = await kv.set(`data_${connectionId}`, JSON.stringify(orderData));
        console.log(saved);
    }

    // Escreve os pedidos atualizados de volta no arquivo
    // await blob.put(pedidosFileName, JSON.stringify(pedidos, null, 2), { contentType: 'application/json; charset=utf-8', addRandomSuffix: false, access: 'public'})

    // Envia uma resposta de sucesso
    res.status(200).json({ success: true });
});

// Rota para obter todos os pedidos
app.get('/api/pedidos', async (req, res) => {
    let pedidos = await getAll();
    res.status(200).json({ pedidos });
});

// Rota SSE para enviar atualizações em tempo real
app.get('/api/sse', async (req, res) => {
    // Configura os cabeçalhos para SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // const connectionId = uuidv4();
    // connections.add(connectionId);
  
    // const sendSSE = (data) => {
    //   res.write(`id: ${connectionId}\n`);
    //   res.write(`data: ${JSON.stringify(data)}\n\n`);
    // };
  
    // const sendDataIfNeeded = async () => {
    //   const data = await kv.get(`data_${connectionId}`);
    //   if (data) {
    //     sendSSE(data);
    //   }
    // };

    function sendSseData(data) {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    let pedidos = await getAll();
  
    sendSseData({ pedidos });

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

// Adiciona uma rota para receber pedidos de clientes em tempo real (exemplo)
app.post('/api/realtime-order', async (req, res) => {
    const orderData = req.body.orderData;

    let saved = await kv.set(orderData.numero, JSON.stringify(orderData));
    await kv.persist(orderData.numero);

    // Envia uma atualização SSE para todos os clientes
    sendSseUpdate({ pedidos: [orderData] });

    res.status(200).json({ success: true });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Rota para remover um pedido
app.delete('/api/pedidos', async (req, res) => {
    const orderData = req.body.orderData;

    let deleted = await kv.del(orderData.numero);

    res.sendStatus(200);
});

// Rota para deletar todos os pedidos
app.delete('/api/pedidos/all', async (req, res) => {
    let pedidos = await kv.keys('*');

    pedidos.forEach(async(pedido) => {
        await kv.del(pedido.numero);
    });

    res.sendStatus(200);
});

// Rota para obter todos os pedidos
app.get('/api/pedidos/all', async(req, res) => {
    let pedidos = await kv.keys('*');
    return res.json(pedidos);
});

// Rota para obter todos os pedidos
app.get('/teste', async (req, res) => {
    return res.send("nothing to see here")
});

async function getAll() {
    let keys = await kv.keys('*');
    return await Promise.all(keys.map(async (key) => await kv.get(key)));
}

// Export the Express API
module.exports = app;