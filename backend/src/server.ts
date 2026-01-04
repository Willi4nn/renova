import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.warn(`🚀 Server running in http://localhost:${PORT}`);
  console.warn(`Clients: http://localhost:${PORT}/api/clients`);
  console.warn(`Orders: http://localhost:${PORT}/api/orders`);
});
