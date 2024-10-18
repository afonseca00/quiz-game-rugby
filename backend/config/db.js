const mysql = require('mysql2'); // Importa o módulo mysql2 para ligar a base de dados MySQL
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

// Cria a conexão com a base de dados utilizando as variáveis de ambiente
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Host da base de dados
  user: process.env.DB_USER, // Usuário da base de dados
  password: process.env.DB_PASS, // Senha da base de dados
  database: process.env.DB_NAME, // Nome da base de dados
  port: process.env.DB_PORT, // Porta da base de dados
});

// Liga a base de dados e exibe uma mensagem de sucesso ou erro
db.connect((err) => {
  if (err) {
    console.error('Erro ao ligar a base de dados MySQL:', err); // Mensagem de erro
    throw err;
  }
  console.log('Ligado a base de dados MySQL.'); // Mensagem de sucesso
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

module.exports = db; // Exporta a conexão da base de dados para uso em outros módulos