document.addEventListener('DOMContentLoaded', () => {
    const currentLang = localStorage.getItem('lang') || 'pt';
    document.documentElement.lang = currentLang;

    updateLanguage(currentLang);
    updatePageLanguage(currentLang);

    document.getElementById('lang-toggle').addEventListener('click', () => {
        const newLang = document.documentElement.lang === 'pt' ? 'en' : 'pt';
        localStorage.setItem('lang', newLang);
        document.documentElement.lang = newLang;

        updateLanguage(newLang);
        updatePageLanguage(newLang);
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const fullName = document.getElementById('full_name').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        try {
            console.log('Tentando registrar com dados:', { username, email, fullName });

            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, fullName })
            });

            const result = await response.json();
            console.log('Resposta do servidor:', result);

            if (response.ok) {
                alert(result.message);
                window.location.href = '../login/login.html';
            } else {
                alert(`Erro: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro ao tentar registrar:', error);
            alert('Ocorreu um erro ao tentar registrar. Tente novamente mais tarde.');
        }
    });
});

function updatePageLanguage(lang) {
    const titleElement = document.querySelector('title');
    const h2Element = document.querySelector('.register-content h2');
    const usernameLabel = document.querySelector('label[for="username"]');
    const emailLabel = document.querySelector('label[for="email"]');
    const fullNameLabel = document.querySelector('label[for="full_name"]');
    const passwordLabel = document.querySelector('label[for="password"]');
    const confirmPasswordLabel = document.querySelector('label[for="confirm_password"]');
    const registerButton = document.querySelector('.btn-primary');
    const loginLinkText = document.querySelector('.register-content p.login-link'); 
    const loginLink = loginLinkText.querySelector('a'); 

    if (titleElement && h2Element && usernameLabel && emailLabel && fullNameLabel && passwordLabel && confirmPasswordLabel && registerButton && loginLink) {
        if (lang === 'en') {
            titleElement.innerText = 'Register - Tackle Trivia';
            h2Element.innerText = 'Register';
            usernameLabel.innerText = 'Username';
            emailLabel.innerText = 'Email';
            fullNameLabel.innerText = 'Full Name';
            passwordLabel.innerText = 'Password';
            confirmPasswordLabel.innerText = 'Confirm Password';
            registerButton.innerText = 'Register';
            loginLinkText.innerHTML = 'Already have an account? <a href="../login/login.html">Login.</a>';
        } else {
            titleElement.innerText = 'Registo - Tackle Trivia';
            h2Element.innerText = 'Registo';
            usernameLabel.innerText = 'Nome de Usuário';
            emailLabel.innerText = 'Email';
            fullNameLabel.innerText = 'Nome Completo';
            passwordLabel.innerText = 'Palavra-passe';
            confirmPasswordLabel.innerText = 'Confirmar Palavra-passe';
            registerButton.innerText = 'Registar';
            loginLinkText.innerHTML = 'Já tem uma conta? <a href="../login/login.html">Iniciar sessão aqui.</a>';
        }
    }
}

function updateLanguage(lang) {
    const flagElement = document.getElementById('flag');
    if (flagElement) {
        flagElement.src = lang === 'en' ? '../images/portugal.png' : '../images/england.png';
        flagElement.alt = lang === 'en' ? 'Portuguese' : 'English';
    }

    // Atualizar o texto dos links comuns no navbar
    document.querySelectorAll('a, button').forEach(el => {
        if (el.href && el.href.includes('login.html')) {
            el.innerText = lang === 'en' ? 'Login' : 'Entrar';
        }
        if (el.href && el.href.includes('register.html')) {
            el.innerText = lang === 'en' ? 'Register' : 'Registe-se';
        }
        if (el.href && el.href.includes('index.html')) {
            el.innerText = lang === 'en' ? 'Home' : 'Início';
        }
    });
}