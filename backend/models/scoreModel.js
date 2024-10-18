const db = require('../config/db'); // Importa a configuração da base de dados

const Score = {
  // Função para registar a pontuação de um user com user_id e quiz_id
  create: (user_id, quiz_id, score, callback) => {
    db.query(
      'INSERT INTO scores (user_id, quiz_id, score) VALUES (?, ?, ?)', 
      [user_id, quiz_id, score], 
      callback
    );
  },

  // Função para obter a soma das pontuações de cada usuário, ordenando pela maior soma
  getTopScores: (callback) => {
    const query = `
      SELECT users.username, SUM(scores.score) AS total_score
      FROM scores
      JOIN users ON scores.user_id = users.id
      GROUP BY users.id
      ORDER BY total_score DESC
      LIMIT 10
    `;
    db.query(query, callback); // Executa a consulta para obter as melhores pontuações
  }
};

module.exports = Score; // Exporta o modelo Score