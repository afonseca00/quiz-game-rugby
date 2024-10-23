const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuração do transportador de e-mail usando Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usando o serviço Gmail
  auth: {
    user: process.env.EMAIL_USER, // Seu email tackletrivia@gmail.com
    pass: process.env.EMAIL_PASS, // Senha de aplicativo gerada pelo Gmail
  },
});

// Função para enviar o email de verificação
exports.sendVerificationEmail = async (email, token) => {
  const verificationLink = `https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/auth/verify-email/${token}`;

  const mailOptions = {
    from: `Tackle Trivia <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifique a sua conta - Tackle Trivia',
    text: `Obrigado por se registar! Por favor, verifique o seu e-mail clicando no link: ${verificationLink}`,
    html: `<p>Obrigado por se registar!</p><p>Por favor, <a href="${verificationLink}">clique aqui</a> para verificar a sua conta.</p>`
  };

  try {
    // Enviar o email
    await transporter.sendMail(mailOptions);
    console.log(`Verificação de email enviada para ${email}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail de verificação:', error);
    throw new Error('Falha no envio do email de verificação');
  }
};

// Função para enviar o email de redefinição de senha
exports.sendPasswordResetEmail = async (email, token) => {
  const resetLink = `https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/reset-password/reset-password.html?token=${token}`; 
  
  const mailOptions = {
    from: `Tackle Trivia <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Redefina a sua palavra-passe - Tackle Trivia',
    text: `Recebemos uma solicitação para redefinir a sua palavra-passe. Clique no link para redefinir: ${resetLink}`,
    html: `<p>Recebemos uma solicitação para redefinir a sua palavra-passe.</p><p><a href="${resetLink}">Clique aqui</a> para redefinir a sua palavra-passe.</p>`
  };

  try {
    // Enviar o email
    await transporter.sendMail(mailOptions);
    console.log(`Email de redefinição de senha enviado para ${email}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail de redefinição de senha:', error);
    throw new Error('Falha no envio do email de redefinição de senha');
  }
};