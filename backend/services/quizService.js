const db = require('../config/db'); // Importa a conexão com o banco de dados
const Question = require('../models/questionModel');
const Score = require('../models/scoreModel');

// Obtem todas as perguntas, ou por categoria se especificada
exports.getAllQuestions = async (category_id) => {
  return new Promise((resolve, reject) => {
    if (category_id) {
      // Usa o filtro de categoria
      Question.getByCategory(category_id, (err, questions) => {
        if (err) reject(err);
        resolve(questions);
      });
    } else {
      // Retorna todas as perguntas
      Question.getAll((err, questions) => {
        if (err) reject(err);
        resolve(questions);
      });
    }
  });
};

// Mantém esta função para buscar perguntas por categoria
exports.getQuestionsByCategory = async (category_id) => {
  return new Promise((resolve, reject) => {
    if (!category_id) {
      reject(new Error('Categoria não especificada'));
    }

    Question.getByCategory(category_id, (err, questions) => {
      if (err) reject(err);
      resolve(questions);
    });
  });
};

// Serviço para registrar a pontuação de um user
exports.createScore = async (user_id, quiz_id, score) => {
  return new Promise((resolve, reject) => {
    Score.create(user_id, quiz_id, score, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Serviço para obter as melhores pontuações
exports.getTopScores = async () => {
  return new Promise((resolve, reject) => {
    Score.getTopScores((err, scores) => {
      if (err) reject(err);
      resolve(scores);
    });
  });
};

// Serviço para obter estatísticas de um usuário (quizzes realizados e pontuação total)
exports.getUserStats = async (user_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        COUNT(quiz_id) AS quizzes_completed, 
        SUM(score) AS total_score 
      FROM scores 
      WHERE user_id = ?
    `;
    
    db.query(query, [user_id], (err, results) => {
      if (err) reject(err);
      resolve(results[0]); // Retorna as estatísticas
    });
  });
};