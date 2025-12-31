const app = require('./app');
const plansRoutes = require('./routes/plans.routes');
const { checkOllamaConnection } = require('./services/ollama');
const db = require('./db/repository');
db.initDb();

const PORT = 3001;

async function startServer() {
  console.log('Checking Ollama connection...');

  const isConnected = await checkOllamaConnection();
  if (!isConnected) {
    console.error('Ollama is NOT running');
    console.error('Please run: ollama serve');
    process.exit(1);
  }

  console.log('Ollama connected');
  
  // Connect all Plans routes
  app.use('/', plansRoutes);

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}


startServer();
