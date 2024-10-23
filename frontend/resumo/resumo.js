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
    // Busca a pontuação e as respostas armazenadas no localStorage
    const score = localStorage.getItem('quizScore');
    const selectedAnswers = JSON.parse(localStorage.getItem('quizAnswers'));
    const questions = JSON.parse(localStorage.getItem('quizQuestions'));

    // Captura os valores do user_id e quiz_id no localStorage
    const user_id = localStorage.getItem('userId'); // Certifique-se de usar 'userId' corretamente
    const quiz_id = questions.length > 0 ? questions[0].quiz_id : null;

    if (!user_id || !quiz_id) {
        console.error('Erro: user_id ou quiz_id não encontrados no localStorage.');
        return;
    }

    const summaryContainer = document.getElementById('summary-container');
    if (!summaryContainer) {
        console.error('Erro: summary-container não encontrado.');
        return;
    }

    summaryContainer.innerHTML = '';

   // Função para gerar o resumo das perguntas e respostas
   questions.forEach((q, index) => {
    const isCorrect = selectedAnswers[index] === q.correct_answer;
    const resultText = isCorrect ? '✅ Correto' : '❌ Errado';

    // Criação do container de resumo
    const summaryItem = document.createElement('div');
    summaryItem.classList.add('summary-item');

    // Título da questão
    const questionTitle = document.createElement('h3');
    questionTitle.textContent = `Questão ${index + 1}: ${q.question}`;
    summaryItem.appendChild(questionTitle);

    // Resposta do usuário
    const userAnswer = document.createElement('p');
    userAnswer.textContent = `Sua Resposta: ${selectedAnswers[index]}`;
    summaryItem.appendChild(userAnswer);

    // Indicação de correto ou incorreto
    const result = document.createElement('p');
    result.textContent = resultText;
    summaryItem.appendChild(result);

    // Se a resposta estiver incorreta, mostrar a resposta correta e a explicação
    if (!isCorrect) {
        const correctAnswer = document.createElement('p');
        correctAnswer.textContent = `Resposta Correta: ${q.correct_answer}`;
        summaryItem.appendChild(correctAnswer);

        const explanation = document.createElement('p');
        explanation.textContent = `Explicação: ${q.explanation}`;
        summaryItem.appendChild(explanation);

        // Se houver um vídeo, criar o iframe e adicioná-lo
        if (q.video_url) {
            const videoIframe = document.createElement('iframe');
            videoIframe.width = '560';
            videoIframe.height = '315';
            videoIframe.src = q.video_url;
            videoIframe.frameBorder = '0';
            videoIframe.allowFullscreen = true;
            summaryItem.appendChild(videoIframe);
        }
    }

    // Adiciona o item ao container do resumo
    summaryContainer.appendChild(summaryItem);
});

    // Exibir a pontuação no resumo
    const scoreItem = `
        <div class="score-item">
            <h3>Sua Pontuação Final: ${score} pontos</h3>
        </div>
    `;
    summaryContainer.innerHTML += scoreItem;

    // Adicionar evento ao botão "Ver Ranking"
    const rankingBtn = document.getElementById('ranking-btn');
    const anotherQuizBtn = document.getElementById('another-quiz-btn');

    if (rankingBtn) {
        rankingBtn.addEventListener('click', () => {
            window.location.href = '../rankings/rankings.html'; // Redireciona para a página de ranking
        });
    }

    if (anotherQuizBtn) {
        anotherQuizBtn.addEventListener('click', () => {
            window.location.href = '../quiz-selector/quiz-selector.html'; // Redireciona para a página de seleção de quiz
        });
    }

    // Enviar pontuação para o backend
    async function submitScore() {
        const payload = {
            user_id: user_id,
            quiz_id: quiz_id,
            score: score
        };

        try {
            const response = await fetch('https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/quiz/submit-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Pontuação enviada com sucesso!', data);
            } else {
                console.error('Erro ao enviar pontuação:', data.error);
            }
        } catch (error) {
            console.error('Erro ao enviar pontuação:', error);
        }
    }

    // Envia a pontuação ao carregar o resumo
    submitScore();
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('Você foi desconectado.');
    window.location.href = '../index/index.html';
});