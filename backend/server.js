require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express');
const cors = require('cors');
const path = require('path'); // Importa o módulo path para manipular caminhos
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura a pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas para a API
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Serve o arquivo index.html para a raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});

// Fallback para outras rotas desconhecidas - para que o roteamento do frontend funcione corretamente
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});

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