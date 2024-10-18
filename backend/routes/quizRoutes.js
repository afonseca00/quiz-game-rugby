const express = require('express'); // Importa o framework Express
const router = express.Router(); // Cria uma instância do router do Express
const quizController = require('../controllers/quizController'); // Importa o controller do quiz

// Define o caminho para obter todas as perguntas do quiz
router.get('/questions', quizController.getQuestions);

// Rota para obter perguntas filtradas por categoria
router.get('/questions', quizController.getQuestionsByCategory);

// Define o caminho para registrar a pontuação de um usuário
router.post('/submit-score', quizController.submitScore); // Rota para submissão de pontuação

// Define o caminho para obter as melhores pontuações
router.get('/top-scores', quizController.getTopScores); // Rota para obter as melhores pontuações

// Rota para obter estatísticas do usuário (quizzes realizados e pontuação total)
router.get('/user-stats', quizController.getUserStats);


module.exports = router; // Exporta o router para uso em outros módulos