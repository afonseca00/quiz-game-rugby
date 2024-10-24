const quizService = require('../services/quizService'); // Importa o serviço do quiz
const db = require('../config/db'); // Importa a conexão com o banco de dados

// Responsável por obter todas as perguntas do quiz, considerando o idioma e a categoria
exports.getQuestions = async (req, res) => {
  const { category_id, language } = req.query; // Pega o category_id e language da query string
  
  try {
    // Validação dos parâmetros da query string
    if (!category_id) {
      return res.status(400).json({ message: 'Categoria não especificada.' });
    }

    if (!language) {
      return res.status(400).json({ message: 'Idioma não especificado.' });
    }

    console.log(`Buscando perguntas para category_id ${category_id} e idioma ${language}.`);

    // Query SQL para buscar as perguntas, incluindo o campo video_url
    const questions = await db.query(
      'SELECT id, question, correct_answer, explanation, video_url, option_1, option_2, option_3 FROM questions WHERE category_id = ? AND language = ?',
      [category_id, language]
    );
    
    // Verifica se há perguntas retornadas
    if (questions.length === 0) {
      return res.status(404).json({ message: 'Nenhuma pergunta encontrada.' });
    }

    res.status(200).json(questions); // Retorna as perguntas com sucesso
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error.message); // Log do erro
    res.status(500).json({ message: 'Erro ao buscar perguntas.', error: error.message });
  }
};

// Responsável por obter perguntas filtradas por categoria, considerando o idioma
exports.getQuestionsByCategory = async (req, res) => {
  const { category_id, language } = req.query;

  try {
    if (!category_id) {
      return res.status(400).json({ message: 'Categoria não especificada.' });
    }

    if (!language) {
      return res.status(400).json({ message: 'Idioma não especificado.' });
    }

    console.log(`Buscando perguntas por categoria_id ${category_id} e idioma ${language}.`);

    const questions = await quizService.getQuestionsByCategoryAndLanguage(category_id, language);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'Nenhuma pergunta encontrada para a categoria e idioma especificados.' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Erro ao buscar perguntas por categoria:', error.message);
    res.status(500).json({ message: 'Erro ao buscar perguntas por categoria.', error: error.message });
  }
};

// Responsável por registrar a pontuação de um usuário
exports.submitScore = async (req, res) => {
  try {
      const { user_id, quiz_id, score } = req.body;
      
      if (!user_id || !quiz_id || score === undefined) {
          return res.status(400).json({ message: 'user_id, quiz_id e score são obrigatórios.' });
      }

      console.log(`Registrando pontuação para user_id ${user_id}, quiz_id ${quiz_id}, pontuação ${score}.`);

      await quizService.createScore(user_id, quiz_id, score);

      res.status(201).json({ message: 'Pontuação registrada com sucesso.' });
  } catch (error) {
      console.error('Erro ao registrar pontuação:', error.message);
      res.status(500).json({ message: 'Erro ao registrar pontuação.', error: error.message });
  }
};

// Responsável por obter as melhores pontuações
exports.getTopScores = async (req, res) => {
  try {
    const scores = await quizService.getTopScores();
    
    if (scores.length === 0) {
      return res.status(404).json({ message: 'Nenhuma pontuação encontrada.' });
    }

    res.status(200).json(scores);
  } catch (error) {
    console.error('Erro ao procurar pontuações:', error.message);
    res.status(500).json({ message: 'Erro ao procurar pontuações.', error: error.message });
  }
};

// Responsável por obter estatísticas do usuário
exports.getUserStats = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ message: 'user_id é obrigatório.' });
    }

    console.log(`Buscando estatísticas para user_id: ${user_id}`);

    const stats = await quizService.getUserStats(user_id);
    
    if (!stats) {
      return res.status(404).json({ message: 'Nenhuma estatística encontrada para o usuário especificado.' });
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas do usuário:', error.message);
    res.status(500).json({ message: 'Erro ao obter estatísticas do usuário.', error: error.message });
  }
};