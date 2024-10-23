const mysql = require('mysql2'); // Importa o módulo mysql2 para ligar a base de dados MySQL
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

// Cria o pool de conexões com a base de dados utilizando as variáveis de ambiente
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Host da base de dados
  user: process.env.DB_USER, // Usuário da base de dados
  password: process.env.DB_PASS, // Senha da base de dados
  database: process.env.DB_NAME, // Nome da base de dados
  port: process.env.DB_PORT, // Porta da base de dados
  waitForConnections: true, // Espera por conexões disponíveis
  connectionLimit: 10, // Limite de conexões simultâneas
  queueLimit: 0 // Sem limite para a fila de requisições
});

// Testa a conexão para verificar se o pool foi criado corretamente
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao ligar a base de dados MySQL:', err.message); // Mensagem de erro
  } else {
    console.log('Ligado à base de dados MySQL.'); // Mensagem de sucesso
    connection.release(); // Libera a conexão de volta ao pool
  }
});

// Envia um ping a cada 60 segundos para manter as conexões ativas
setInterval(() => {
  pool.query('SELECT 1', (err) => {
    if (err) {
      console.error('Erro no ping para manter a conexão ativa:', err.message); // Log do erro no ping
    } else {
      console.log('Ping bem-sucedido para manter a conexão ativa.'); // Log do sucesso do ping
    }
  });
}, 60000);

module.exports = pool.promise(); // Exporta o pool de conexões para uso em Promises