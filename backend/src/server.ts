import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.warn(`🚀 Server running in http://localhost:${PORT}`);
  console.warn(`📡 Test the health check at http://localhost:${PORT}/health`);
});
