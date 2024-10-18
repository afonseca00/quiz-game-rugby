const path = require('path');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Rota raiz para servir o arquivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index', 'index.html'));
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Middleware de tratamento de erros
app.use(errorMiddleware);

// Inicia o servidor na porta especificada nas variáveis de ambiente ou 5000
const PORT = process.env.PORT || 5000;

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

module.exports = app;