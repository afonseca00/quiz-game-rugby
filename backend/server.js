require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express'); // Framework web para Node.js
const cors = require('cors'); // Middleware para habilitar CORS
const path = require('path'); // Módulo para trabalhar com caminhos de arquivos
const authRoutes = require('./routes/authRoutes'); // Rotas de autenticação
const quizRoutes = require('./routes/quizRoutes'); // Rotas do quiz
const errorMiddleware = require('./middleware/errorMiddleware'); // Middleware de tratamento de erros
const db = require('./config/db'); // Conexão com o banco de dados

const app = express(); // Cria uma instância do Express

// Middleware
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Prepara parsing de JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Prepara parsing de URL-encoded no corpo das requisições

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rota raiz para servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Middleware de tratamento de erros
app.use(errorMiddleware);

// Inicia o servidor na porta especificada nas variáveis de ambiente ou 5000
const PORT = process.env.PORT || 5000;

// Verifica a conexão com o banco de dados antes de iniciar o servidor
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1); // Sai do processo se houver erro na conexão com o banco de dados
  } else {
    console.log('Conectado ao banco de dados MySQL.');
    app.listen(PORT, () => {
      console.log(`Servidor a trabalhar na porta ${PORT}`);
    });
  }
});

module.exports = app; // Exporta a instância do Express para testes