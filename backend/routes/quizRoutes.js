const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController'); // Importa o controller do quiz

// Rota para obter todas as perguntas do quiz
router.get('/questions', quizController.getQuestions);

// Rota para obter perguntas filtradas por categoria e idioma
router.get('/questions-by-category', quizController.getQuestionsByCategory);

// Rota para registar a pontuação de um utilizador
router.post('/submit-score', quizController.submitScore);

// Rota para obter as melhores pontuações
router.get('/top-scores', quizController.getTopScores);

// Rota para obter estatísticas do utilizador (quizzes realizados e pontuação total)
router.get('/user-stats', quizController.getUserStats);

module.exports = router;