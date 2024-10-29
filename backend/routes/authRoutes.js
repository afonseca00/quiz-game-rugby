const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const quizController = require('../controllers/quizController'); // Importa o controlador de quiz

// Rotas de autenticação
router.post('/register', authController.register);
router.post('/login', authController.login); // Adicionando a rota de login
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

// Rotas de quiz
router.get('/quiz/questions', quizController.getQuestions); // Rota para obter todas as perguntas
router.post('/quiz/submit-score', quizController.submitScore); // Rota para enviar pontuações
router.get('/quiz/top-scores', quizController.getTopScores); // Rota para obter as melhores pontuações

// Atualizar informações pessoais
router.put('/update-info', authController.updateUserInfo);

// Alterar senha
router.put('/change-password', authController.changePassword);

module.exports = router;