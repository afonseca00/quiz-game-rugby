const db = require('../config/db');

const Question = {
  // Função para obter todas as perguntas
  getAll: (callback) => {
    db.query('SELECT id, question, correct_answer, option_1, option_2, option_3, explanation, video_url, category_id FROM questions', callback);
  },
  
  // Função para obter perguntas por categoria
  getByCategory: (category_id, callback) => {
    db.query('SELECT id, question, correct_answer, option_1, option_2, option_3, explanation, video_url, category_id, quiz_id FROM questions WHERE category_id = ?',
    [category_id],
    callback);
  },
  
  // Função para obter uma pergunta por ID
  getById: (id, callback) => {
    db.query('SELECT * FROM questions WHERE id = ?', [id], callback); 
  }
  
};

module.exports = Question;