import cors from 'cors';
import express from 'express';
import { checkPort, checkProxy } from './functions.js';

const app = express();

app.use(cors());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
