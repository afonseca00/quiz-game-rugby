const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas de autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

// Atualizar informações pessoais
router.put('/update-info', authController.updateUserInfo);

// Alterar senha
router.put('/change-password', authController.changePassword);

module.exports = router;