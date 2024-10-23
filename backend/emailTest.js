const nodemailer = require('nodemailer');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Configura o transportador de e-mail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para outras portas como 587
  auth: {
    user: process.env.EMAIL_USER, // Seu e-mail
    pass: process.env.EMAIL_PASS  // Senha de aplicativo gerada
  }
});

// Configuração do e-mail a ser enviado
const mailOptions = {
  from: process.env.EMAIL_USER, // Remetente
  to: 'emaildestino@example.com', // Destinatário (troque pelo e-mail de destino)
  subject: 'Testando envio de e-mail', // Assunto do e-mail
  text: 'Este é um e-mail de teste enviado pelo terminal usando nodemailer!' // Conteúdo do e-mail
};

// Envia o e-mail
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Erro ao enviar e-mail:', error);
  }
  console.log('E-mail enviado com sucesso:', info.response);
});