// Função específica para atualizar o conteúdo dinâmico da página de Login
function updatePageLanguage(lang) {
    console.log(`Atualizando idioma para: ${lang}`);
    const titleElement = document.querySelector('title');
    const h2Element = document.querySelector('.login-content h2');
    const usernameLabel = document.querySelector('label[for="username"]');
    const passwordLabel = document.querySelector('label[for="password"]');
    const loginButton = document.querySelector('.btn-primary');
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    const registerParagraph = document.querySelector('.login-content p.register-link');

    console.log('Elementos encontrados:', {
        titleElement,
        h2Element,
        usernameLabel,
        passwordLabel,
        loginButton,
        forgotPasswordLink,
        registerParagraph
    });

    if (titleElement && h2Element && usernameLabel && passwordLabel && loginButton && forgotPasswordLink && registerParagraph) {
        if (lang === 'en') {
            titleElement.innerText = 'Login - Tackle Trivia';
            h2Element.innerText = 'Login';
            usernameLabel.innerText = 'Username or Email';
            passwordLabel.innerText = 'Password';
            loginButton.innerText = 'Login';
            forgotPasswordLink.innerText = 'Forgot Password?';
            registerParagraph.innerHTML = `Don't have an account? <a href="../register/register.html">Register here</a>.`;
        } else {
            titleElement.innerText = 'Login - Tackle Trivia';
            h2Element.innerText = 'Entrar';
            usernameLabel.innerText = 'User ou Email';
            passwordLabel.innerText = 'Palavra-passe';
            loginButton.innerText = 'Entrar';
            forgotPasswordLink.innerText = 'Esqueceu-se da palavra-passe?';
            registerParagraph.innerHTML = `Não tem uma conta? <a href="../register/register.html">Registe-se aqui</a>.`;
        }

        console.log('Conteúdo atualizado:', {
            title: titleElement.innerText,
            h2: h2Element.innerText,
            usernameLabel: usernameLabel.innerText,
            passwordLabel: passwordLabel.innerText,
            loginButton: loginButton.innerText,
            forgotPasswordLink: forgotPasswordLink.innerText,
            registerParagraph: registerParagraph.innerHTML
        });
    } else {
        console.error("Um ou mais elementos não foram encontrados.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Atualizar idioma baseado no localStorage ou padrão
    const currentLang = localStorage.getItem('lang') || 'pt';
    document.documentElement.lang = currentLang;

    // Atualizar a página com o idioma atual
    updatePageLanguage(currentLang);

    // Adicionar evento de clique para alternar idioma
    document.getElementById('lang-toggle').addEventListener('click', () => {
        const newLang = document.documentElement.lang === 'pt' ? 'en' : 'pt';
        localStorage.setItem('lang', newLang);
        document.documentElement.lang = newLang;
        updatePageLanguage(newLang);
    });

    // Função para manipular o evento de submissão do formulário de login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir o comportamento padrão do formulário

        // Capturar os dados do formulário
        const identifier = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Fazer uma requisição para o backend
            const response = await fetch('http://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identifier, password })
            });

            const result = await response.json();

            if (response.ok) {
                // Armazenar o token JWT, nome do usuário e ID do usuário no localStorage
                localStorage.setItem('token', result.token);
                localStorage.setItem('userName', result.userName); // Certifique-se de que o userName está armazenado
                localStorage.setItem('userId', result.userId); // Certifique-se de armazenar o userId

                // Exibir mensagem de sucesso e redirecionar o usuário
                alert(result.message);
                window.location.href = '../dashboard/dashboard.html'; // Redirecionar para dashboard
            } else {
                // Exibir mensagem de erro se o login falhar
                alert(`Erro: ${result.message}`); // Correção no template literal
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
        }
    });
});