const db = require('../config/db'); // Importa a conexão com o banco de dados
const Score = require('../models/scoreModel');

// Serviço para obter todas as perguntas com suporte a idioma
exports.getAllQuestions = async (language) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT qt.question, qt.correct_answer, qt.option_1, qt.option_2, qt.option_3, qt.explanation
      FROM questions q
      JOIN question_translations qt ON q.id = qt.question_id
      WHERE qt.language = ?;
    `;
    
    db.query(query, [language], (err, questions) => {
      if (err) {
        reject(err);
      } else {
        resolve(questions);
      }
    });
  });
};

// Serviço para obter perguntas por categoria com suporte a idioma
exports.getQuestionsByCategoryAndLanguage = async (category_id, language) => {
  return new Promise((resolve, reject) => {
    if (!category_id || !language) {
      reject(new Error('Categoria e idioma são obrigatórios.'));
    }

    const query = `
      SELECT qt.question, qt.correct_answer, qt.option_1, qt.option_2, qt.option_3, qt.explanation
      FROM questions q
      JOIN question_translations qt ON q.id = qt.question_id
      WHERE q.category_id = ? AND qt.language = ?;
    `;
    
    db.query(query, [category_id, language], (err, questions) => {
      if (err) {
        reject(err);
      } else {
        resolve(questions);
      }
    });
  });
};

// Serviço para registrar a pontuação de um usuário
exports.createScore = async (user_id, quiz_id, score) => {
  return new Promise((resolve, reject) => {
    Score.create(user_id, quiz_id, score, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Serviço para obter as melhores pontuações
exports.getTopScores = async () => {
  return new Promise((resolve, reject) => {
    Score.getTopScores((err, scores) => {
      if (err) {
        reject(err);
      } else {
        resolve(scores);
      }
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
      if (err) {
        reject(err);
      } else {
        resolve(results[0]); // Retorna as estatísticas
      }
    });
  });
};