// Middleware de tratamento de erros
module.exports = (err, req, res, next) => {
    console.error(err.stack); // Liga o stack trace do erro no console
    res.status(500).json({ message: 'Ocorreu um erro no servidor.', error: err.message }); // Envia uma resposta de erro para o cliente
  };