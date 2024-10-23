const db = require('../config/db'); // Importa o pool de conexões
const bcrypt = require('bcrypt');

const User = {
  create: async (username, email, password, fullName) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, fullName],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  findByUsernameOrEmail: (identifier) => {
    return new Promise((resolve, reject) => {
      console.log(`Buscando usuário com identifier: ${identifier}`);
      db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [identifier, identifier],
        (err, results) => {
          if (err) {
            console.error('Erro ao buscar usuário por username ou email:', err);
            return reject(err);
          }
          if (!results || results.length === 0) {
            console.log('Nenhum usuário encontrado.');
          } else {
            console.log('Usuário encontrado:', results[0]);
          }
          resolve(results[0]);
        }
      );
    });
  },

  updateVerificationToken: (userId, token) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET verification_token = ? WHERE id = ?',
        [token, userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  updatePasswordResetToken: (userId, token, expiry) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET password_reset_token = ?, password_reset_expiry = ? WHERE id = ?',
        [token, expiry, userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  findByPasswordResetToken: (token) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE password_reset_token = ?',
        [token],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  },

  updatePassword: (userId, newPassword) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [newPassword, userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  activateUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET is_verified = true WHERE id = ?',
        [userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  findByVerificationToken: (token) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE verification_token = ?',
        [token],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }
};

// Atualizar informações pessoais
User.updateUserInfo = (user_id, fullName, email) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE users SET full_name = ?, email = ? WHERE id = ?',
      [fullName, email, user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// Buscar usuário por ID
User.findById = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ?', [user_id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

// Atualizar senha do usuário
User.updatePassword = (user_id, newPassword) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, user_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = User;