require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express'); // Framework web para Node.js
const cors = require('cors'); // Middleware para habilitar CORS
const path = require('path'); // Manipulação de caminhos
const authRoutes = require('./routes/authRoutes'); // Rotas de autenticação
const quizRoutes = require('./routes/quizRoutes'); // Rotas do quiz
const errorMiddleware = require('./middleware/errorMiddleware'); // Middleware de tratamento de erros
const db = require('./config/db'); // Conexão com o banco de dados

const app = express(); // Instância do Express

// Configuração de CORS com opções específicas
const corsOptions = {
  origin: 'https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net', // Domínio permitido (produção)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Permitir envio de cookies
};

app.use(cors(corsOptions)); // Habilita CORS com as opções

// Middleware de parsing
app.use(express.json()); // Parsing de JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Parsing de URL-encoded

// Configura a pasta de arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Rota principal servindo o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});

// Fallback para outras rotas não definidas (para frontend SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});

// Middleware de tratamento de erros
app.use(errorMiddleware);

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Porta do servidor
const PORT = process.env.PORT || 5000;

// Conexão com o banco de dados
db.query('SELECT 1', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message); // Log detalhado do erro
    process.exit(1); // Sai do processo em caso de erro
  } else {
    console.log('Conectado ao banco de dados MySQL.');
    app.listen(PORT, () => {
      console.log(`Servidor a trabalhar na porta ${PORT}`); // Correção da interpolação
    });
  }
});

module.exports = app; // Exporta a instância do Express para testes