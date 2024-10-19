require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express'); // Framework web para Node.js
const cors = require('cors'); // Middleware para habilitar CORS
const path = require('path'); // Importa o módulo path para manipular caminhos
const authRoutes = require('./routes/authRoutes'); // Rotas de autenticação
const quizRoutes = require('./routes/quizRoutes'); // Rotas do quiz
const errorMiddleware = require('./middleware/errorMiddleware'); // Middleware de tratamento de erros
const db = require('./config/db'); // Conexão com o banco de dados

const app = express(); // Cria uma instância do Express

// Configuração de CORS com opções específicas para o domínio do Azure
const corsOptions = {
  origin: 'https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net', // Domínio permitido
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};

app.use(cors(corsOptions)); // Habilita CORS com as opções definidas

// Middleware para parsing de requisições
app.use(express.json()); // Prepara parsing de JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Prepara parsing de URL-encoded no corpo das requisições

// Configura a pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas para a API
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Serve o arquivo index.html para a raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});

// Fallback para qualquer rota desconhecida, garantindo que o roteamento do frontend funcione corretamente
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

module.exports = app; // Exporta a instância do Express para testes