const quizService = require('../services/quizService'); // Importa o serviço do quiz

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

    const questions = await quizService.getAllQuestions(category_id, language); // Passa o category_id e o idioma para o serviço
    
    // Verifica se cada pergunta possui video_url
    questions.forEach(question => {
      if (!question.video_url) {
        console.warn("Pergunta sem campo video_url:", question.question);
      }
    });

    res.status(200).json(questions); // Retorna as perguntas com video_url para o frontend
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error.message); // Log do erro
    res.status(500).json({ message: 'Erro ao buscar perguntas.', error: error.message });
  }
};

// Responsável por obter perguntas filtradas por categoria, considerando o idioma
exports.getQuestionsByCategory = async (req, res) => {
  const { category_id, language } = req.query; // Pega o category_id e language da query string

  try {
    // Validações
    if (!category_id) {
      return res.status(400).json({ message: 'Categoria não especificada.' });
    }

    if (!language) {
      return res.status(400).json({ message: 'Idioma não especificado.' });
    }

    console.log(`Buscando perguntas por categoria_id ${category_id} e idioma ${language}.`);

    const questions = await quizService.getQuestionsByCategoryAndLanguage(category_id, language); // Passa o category_id e o idioma para o serviço

    // Verifica se há perguntas retornadas
    if (questions.length === 0) {
      return res.status(404).json({ message: 'Nenhuma pergunta encontrada para a categoria e idioma especificados.' });
    }

    res.status(200).json(questions); // Retorna a resposta com as perguntas filtradas
  } catch (error) {
    console.error('Erro ao buscar perguntas por categoria:', error.message); // Log do erro
    res.status(500).json({ message: 'Erro ao buscar perguntas por categoria.', error: error.message });
  }
};

// Responsável por registar a pontuação de um utilizador
exports.submitScore = async (req, res) => {
  try {
      const { user_id, quiz_id, score } = req.body; // Extrai user_id, quiz_id e score do corpo da requisição
      
      // Validações
      if (!user_id || !quiz_id || score === undefined) {
          return res.status(400).json({ message: 'user_id, quiz_id e score são obrigatórios.' });
      }

      console.log(`Registrando pontuação para user_id ${user_id}, quiz_id ${quiz_id}, pontuação ${score}.`);

      // Chama o serviço para registar a pontuação
      await quizService.createScore(user_id, quiz_id, score); 

      res.status(201).json({ message: 'Pontuação registrada com sucesso.' });
  } catch (error) {
      console.error('Erro ao registar pontuação:', error.message); // Log do erro
      res.status(500).json({ message: 'Erro ao registar pontuação.', error: error.message });
  }
};

// Responsável por obter as melhores pontuações
exports.getTopScores = async (req, res) => {
  try {
    const scores = await quizService.getTopScores(); // Chama o serviço para obter as melhores pontuações
    
    if (scores.length === 0) {
      return res.status(404).json({ message: 'Nenhuma pontuação encontrada.' });
    }

    res.status(200).json(scores); // Retorna uma resposta de sucesso com as pontuações
  } catch (error) {
    console.error('Erro ao procurar pontuações:', error.message); // Log do erro
    res.status(500).json({ message: 'Erro ao procurar pontuações.', error: error.message });
  }
};

// Responsável por obter estatísticas do utilizador
exports.getUserStats = async (req, res) => {
  try {
    const { user_id } = req.query; // Pega o user_id da query string
    
    // Validação
    if (!user_id) {
      return res.status(400).json({ message: 'user_id é obrigatório.' });
    }

    console.log(`Buscando estatísticas para user_id: ${user_id}`); // Log para depuração

    const stats = await quizService.getUserStats(user_id); // Chama o serviço para obter as estatísticas do utilizador
    
    if (!stats) {
      return res.status(404).json({ message: 'Nenhuma estatística encontrada para o utilizador especificado.' });
    }

    res.status(200).json(stats); // Retorna uma resposta de sucesso com as estatísticas
  } catch (error) {
    console.error('Erro ao obter estatísticas do utilizador:', error.message); // Log do erro
    res.status(500).json({ message: 'Erro ao obter estatísticas do utilizador.', error: error.message });
  }
};