import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkPort, checkProxy } from './functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.get('/start-check', async(req, res) => {
    const ip = req.query.ip;
    const port = req.query.port;

    try {
      const portCheckResult = await checkPort(ip, port);
      if (portCheckResult) {
          const proxyCheckResult = await checkProxy();
          const data = {
              ip,
              port,
              message: proxyCheckResult ? 'Proxy detected' : 'No proxy detected'
          };
          res.json(data);
      } else {
          res.json({ ip, port, message: 'Failed request' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred while executing the request' });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
