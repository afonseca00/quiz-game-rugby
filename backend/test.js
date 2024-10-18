const request = require('supertest');
const expect = require('chai').expect;
const app = require('./server'); // Certifique-se de exportar a instância do Express no seu server.js
const db = require('./config/db');

describe('API Tests', () => {
  let token;
  let verificationToken;

  before((done) => {
    db.query('DELETE FROM scores', (err) => {
      if (err) return done(err);
      db.query('DELETE FROM users', done);
    });
  });

  it('should register a user', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123', fullName: 'Test User' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Usuário registrado com sucesso. Verifique seu email para ativar sua conta.');
        
        // Retrieve the verification token from the database
        db.query('SELECT verification_token FROM users WHERE email = ?', ['test@example.com'], (err, results) => {
          if (err) return done(err);
          verificationToken = results[0].verification_token;
          done();
        });
      });
  });

  it('should verify the user email', (done) => {
    request(app)
      .get(`/api/auth/verify-email/${verificationToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Email verificado com sucesso.');
        done();
      });
  });

  it('should not register a user with the same email', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({ username: 'anotheruser', email: 'test@example.com', password: 'password123', fullName: 'Another User' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Email já está em uso.');
        done();
      });
  });

  it('should not register a user with the same username', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'another@example.com', password: 'password123', fullName: 'Another User' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Username já está em uso.');
        done();
      });
  });

  it('should login a user with username', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ identifier: 'testuser', password: 'password123' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Login realizado com sucesso.');
        token = res.body.token; // Save the token for subsequent tests
        done();
      });
  });

  it('should login a user with email', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ identifier: 'test@example.com', password: 'password123' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Login realizado com sucesso.');
        token = res.body.token; // Save the token for subsequent tests
        done();
      });
  });

  it('should request password reset', (done) => {
    request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: 'test@example.com' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Email para redefinição de senha enviado.');
        done();
      });
  });

  it('should reset password', (done) => {
    // First, we need to simulate requesting a password reset and getting the token
    request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: 'test@example.com' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        
        // Simulate retrieving the token from the email (this would be handled by the email service in a real scenario)
        db.query('SELECT password_reset_token FROM users WHERE email = ?', ['test@example.com'], (err, results) => {
          if (err) return done(err);
          const token = results[0].password_reset_token;

          // Now, reset the password using the token
          request(app)
            .post('/api/auth/reset-password')
            .send({ token, newPassword: 'newpassword123' })
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body.message).to.equal('Senha redefinida com sucesso.');
              done();
            });
        });
      });
  });

  it('should not login with old password after reset', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ identifier: 'testuser', password: 'password123' })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Senha incorreta.');
        done();
      });
  });

  it('should login with new password after reset', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ identifier: 'testuser', password: 'newpassword123' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Login realizado com sucesso.');
        token = res.body.token; // Save the token for subsequent tests
        done();
      });
  });
});