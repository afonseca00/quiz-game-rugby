const quizService = require('../services/quizService'); // Importa o serviço do quiz

// Responsavel por obter todas as perguntas do quiz
exports.getQuestions = async (req, res) => {
  const { category_id } = req.query; // Pega o category_id da query string
  try {
    const questions = await quizService.getAllQuestions(category_id); // Passa o category_id para o serviço
    res.status(200).json(questions); // Retorna a resposta com as perguntas
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perguntas.', error: error.message });
  }
};

// Responsável por obter perguntas filtradas por categoria
exports.getQuestionsByCategory = async (req, res) => {
  const { category_id } = req.query; // Captura o category_id da query string
  console.log('Category ID:', category_id); // Para verificar se o category_id está correto
  try {
    if (!category_id) {
      return res.status(400).json({ message: 'Categoria não especificada' });
    }

    const questions = await quizService.getQuestionsByCategory(category_id); // Chama o serviço para obter perguntas filtradas
    res.status(200).json(questions); // Retorna a resposta com as perguntas filtradas
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perguntas por categoria.', error: error.message });
  }
};

// Responsável por registrar a pontuação de um usuário
exports.submitScore = async (req, res) => {
  try {
      const { user_id, quiz_id, score } = req.body; // Extrai user_id, quiz_id e score do corpo da requisição
      
      if (!user_id || !quiz_id || !score) {
          return res.status(400).json({ message: 'user_id, quiz_id e score são obrigatórios.' });
      }

      // Chama o serviço para registrar a pontuação
      await quizService.createScore(user_id, quiz_id, score); 

      res.status(201).json({ message: 'Pontuação registrada com sucesso.' }); // Retorna uma resposta de sucesso
  } catch (error) {
      res.status(500).json({ message: 'Erro ao registrar pontuação.', error: error.message });
  }
};

// Responsável por obter as melhores pontuações
exports.getTopScores = async (req, res) => {
  try {
    const scores = await quizService.getTopScores(); // Chama o serviço para obter as melhores pontuações
    res.status(200).json(scores); // Retorna uma resposta de sucesso com as pontuações
  } catch (error) {
    res.status(500).json({ message: 'Erro ao procurar pontuações.', error: error.message }); // Retorna uma resposta de erro
  }
};

// Responsável por obter estatísticas do usuário
exports.getUserStats = async (req, res) => {
  try {
    const { user_id } = req.query; // Pega o user_id da query string
    
    if (!user_id) {
      return res.status(400).json({ message: 'user_id é obrigatório.' });
    }

    const stats = await quizService.getUserStats(user_id); // Chama o serviço para obter as estatísticas do usuário
    res.status(200).json(stats); // Retorna uma resposta de sucesso com as estatísticas
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter estatísticas do usuário.', error: error.message });
  }
};