const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../services/emailService').sendVerificationEmail;
const sendPasswordResetEmail = require('../services/emailService').sendPasswordResetEmail;

exports.register = async (req, res) => {
  const { username, email, password, fullName } = req.body;
  try {
    console.log('Tentando registrar usuário:', { username, email, fullName });

    // Verificar se o email já está em uso
    const emailExists = await User.findByEmail(email);
    if (emailExists) {
      console.log('Email já está em uso:', email);
      return res.status(400).json({ message: 'Email já está em uso.' });
    }

    // Verificar se o username já está em uso
    const usernameExists = await User.findByUsername(username);
    if (usernameExists) {
      console.log('Username já está em uso:', username);
      return res.status(400).json({ message: 'Username já está em uso.' });
    }

    // Gerar token de verificação
    const token = crypto.randomBytes(20).toString('hex');
    console.log('Gerando token de verificação:', token);

    // Enviar email de verificação
    try {
      await sendVerificationEmail(email, token);
      console.log('Email de verificação enviado para:', email);
    } catch (error) {
      console.error('Erro ao enviar e-mail de verificação:', error.message);
      return res.status(500).json({ message: 'Erro ao enviar e-mail de verificação.', error: error.message });
    }

    // Criação do usuário após o envio bem-sucedido do e-mail
    console.log('Criando usuário...');
    const user = await User.create(username, email, password, fullName);
    console.log('Usuário criado com sucesso:', user);

    // Atualizar o token de verificação no banco de dados
    await User.updateVerificationToken(user.insertId, token);

    res.status(201).json({ message: 'Usuário registrado com sucesso. Verifique seu email para ativar sua conta.' });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err.message, err.stack);
    res.status(500).json({ message: 'Erro ao registrar usuário.', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body; // identifier pode ser email ou username
  try {
    console.log('Tentando login com:', { identifier });

    const user = await User.findByUsernameOrEmail(identifier);
    if (!user) {
      console.log('Usuário não encontrado:', identifier);
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Senha incorreta para usuário:', identifier);
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    if (!user.is_verified) {
      console.log('Usuário não verificado:', identifier);
      return res.status(403).json({ message: 'Verifique seu email para ativar sua conta.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
      userName: user.username,  // Incluindo o nome de usuário na resposta
      userId: user.id  // Incluindo o user_id na resposta
    });
  } catch (err) {
    console.error('Erro ao realizar login:', err);
    res.status(500).json({ message: 'Erro ao realizar login.', error: err.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    console.log('Solicitação de redefinição de senha para:', email);

    const user = await User.findByEmail(email);
    if (!user) {
      console.log('Usuário não encontrado para redefinição de senha:', email);
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hora de validade
    await User.updatePasswordResetToken(user.id, token, expiry);

    await sendPasswordResetEmail(email, token);

    res.status(200).json({ message: 'Email para redefinição de senha enviado.' });
  } catch (err) {
    console.error('Erro ao solicitar redefinição de senha:', err);
    res.status(500).json({ message: 'Erro ao solicitar redefinição de senha.', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    console.log('Redefinindo senha com token:', token);

    const user = await User.findByPasswordResetToken(token);
    if (!user || user.password_reset_expiry < new Date()) {
      console.log('Token inválido ou expirado:', token);
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hashedPassword);

    await User.updatePasswordResetToken(user.id, null, null);

    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ message: 'Erro ao redefinir senha.', error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params; // Captura o token dos parâmetros da URL
  try {
    console.log('Verificando email com token:', token);

    const user = await User.findByVerificationToken(token);
    if (!user) {
      console.log('Token de verificação inválido:', token);
      return res.status(400).json({ message: 'Token inválido.' });
    }

    await User.activateUser(user.id);

    res.status(200).json({ message: 'Email verificado com sucesso.' });
  } catch (err) {
    console.error('Erro ao verificar email:', err);
    res.status(500).json({ message: 'Erro ao verificar email.', error: err.message });
  }
};

// Atualizar informações pessoais
exports.updateUserInfo = async (req, res) => {
  const { user_id, fullName, email } = req.body;

  if (!user_id || !fullName || !email) {
    return res.status(400).json({ message: 'user_id, nome completo e email são obrigatórios.' });
  }

  try {
    const updatedUser = await User.updateUserInfo(user_id, fullName, email);
    res.status(200).json({ message: 'Informações atualizadas com sucesso!', user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar informações:', error);
    res.status(500).json({ message: 'Erro ao atualizar informações.', error: error.message });
  }
};

// Alterar a senha do usuário
exports.changePassword = async (req, res) => {
  const { user_id, currentPassword, newPassword } = req.body;

  if (!user_id || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'user_id, senha atual e nova senha são obrigatórios.' });
  }

  try {
    const user = await User.findById(user_id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user_id, hashedPassword);

    res.status(200).json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro ao alterar senha.', error: error.message });
  }
};