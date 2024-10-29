const db = require('../config/db'); // Importa a conexão com o banco de dados
const Score = require('../models/scoreModel');

// Serviço para obter todas as perguntas com suporte a idioma e categoria
exports.getAllQuestions = async (category_id, language) => {
  return new Promise((resolve, reject) => {
    if (!category_id || !language) {
      console.error('Erro: Categoria ou idioma não especificado.');
      return reject(new Error('Categoria e idioma são obrigatórios.'));
    }

    // Atualizando a consulta para incluir o campo video_url
    const query = `
      SELECT question, correct_answer, option_1, option_2, option_3, explanation, video_url, quiz_id
      FROM questions
      WHERE category_id = ? AND language = ?;
    `;
    
    db.query(query, [category_id, language], (err, questions) => {
      if (err) {
        console.error(`Erro ao buscar perguntas para categoria ${category_id} e idioma ${language}:`, err);
        return reject(new Error('Erro ao buscar perguntas.'));
      } 
      
      if (questions.length === 0) {
        console.warn(`Nenhuma pergunta encontrada para categoria ${category_id} e idioma ${language}.`);
      }
      
      resolve(questions);
    });
  });
};

// Serviço para obter perguntas por categoria com suporte a idioma (mesma lógica do getAllQuestions)
exports.getQuestionsByCategoryAndLanguage = async (category_id, language) => {
  return exports.getAllQuestions(category_id, language); // Reutiliza a função acima
};

// Serviço para registrar a pontuação de um usuário
exports.createScore = async (user_id, quiz_id, score) => {
  return new Promise((resolve, reject) => {
    if (!user_id || !quiz_id || score === undefined) {
      console.error('Erro: user_id, quiz_id e score são obrigatórios.');
      return reject(new Error('user_id, quiz_id e score são obrigatórios.'));
    }

    Score.create(user_id, quiz_id, score, (err, result) => {
      if (err) {
        console.error(`Erro ao registrar pontuação para user_id ${user_id}, quiz_id ${quiz_id}:`, err);
        return reject(new Error('Erro ao registrar pontuação.'));
      }
      resolve(result);
    });
  });
};

// Serviço para obter as melhores pontuações
exports.getTopScores = async () => {
  return new Promise((resolve, reject) => {
    Score.getTopScores((err, scores) => {
      if (err) {
        console.error('Erro ao buscar melhores pontuações:', err);
        return reject(new Error('Erro ao buscar melhores pontuações.'));
      }
      resolve(scores);
    });
  });
};

// Serviço para obter estatísticas de um usuário (quizzes realizados e pontuação total)
exports.getUserStats = async (user_id) => {
  return new Promise((resolve, reject) => {
    if (!user_id) {
      console.error('Erro: user_id é obrigatório.');
      return reject(new Error('user_id é obrigatório.'));
    }

    const query = `
      SELECT 
        COUNT(quiz_id) AS quizzes_completed, 
        SUM(score) AS total_score 
      FROM scores 
      WHERE user_id = ?
    `;
    
    db.query(query, [user_id], (err, results) => {
      if (err) {
        console.error(`Erro ao obter estatísticas do usuário ${user_id}:`, err);
        return reject(new Error('Erro ao obter estatísticas do usuário.'));
      }
      resolve(results[0]); // Retorna as estatísticas
    });
  });
};