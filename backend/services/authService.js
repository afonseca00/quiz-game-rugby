const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Usado para criar tokens de verificação
const sendVerificationEmail = require('../services/emailService').sendVerificationEmail;

exports.registerUser = async (username, password, email, fullName) => {
  try {
    // Verificar se o email já está em uso
    const emailExists = await User.findByEmail(email);
    if (emailExists) {
      throw new Error('Email já está em uso.');
    }

    // Verificar se o username já está em uso
    const usernameExists = await User.findByUsername(username);
    if (usernameExists) {
      throw new Error('Username já está em uso.');
    }

    // Criar o novo usuário com hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(username, email, hashedPassword, fullName);

    // Gerar um token de verificação para o email
    const verificationToken = crypto.randomBytes(20).toString('hex');
    await User.updateVerificationToken(user.id, verificationToken);

    // Enviar email de verificação
    await sendVerificationEmail(email, verificationToken);

    return {
      message: 'Usuário registrado com sucesso. Verifique seu email para ativar sua conta.',
    };
  } catch (err) {
    console.error('Erro ao registrar usuário:', err.message);
    throw new Error('Erro ao registrar usuário.');
  }
};

// Faz login de um usuário
exports.loginUser = async (usernameOrEmail, password) => {
  try {
    // Verificar se o username ou o email é válido
    const user = await User.findByUsernameOrEmail(usernameOrEmail);
    if (!user) throw new Error('Usuário não encontrado.');

    // Verificar se o email foi verificado
    if (!user.is_verified) throw new Error('Verifique seu email para ativar sua conta.');

    // Comparar a senha fornecida com o hash armazenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Senha incorreta.');

    // Gerar um token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return { message: 'Login realizado com sucesso.', token };
  } catch (err) {
    console.error('Erro ao fazer login:', err.message);
    throw new Error(err.message || 'Erro ao fazer login.');
  }
};