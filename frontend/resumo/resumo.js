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
    const lang = localStorage.getItem('language') || 'pt'; // Defina o idioma com base no armazenamento ou padrão como 'pt'

    const questions = JSON.parse(localStorage.getItem('quizQuestions'));
    const selectedAnswers = JSON.parse(localStorage.getItem('quizAnswers'));
    const score = localStorage.getItem('quizScore');

    console.log("Questões carregadas do localStorage:", questions);

    const summaryContainer = document.getElementById('summary-container');
    if (!summaryContainer) {
        console.error('Erro: summary-container não encontrado.');
        return;
    }

    summaryContainer.innerHTML = '';

    function convertToEmbedUrl(videoUrl) {
        if (!videoUrl) return null;
        if (videoUrl.includes('youtube.com/embed')) {
            return videoUrl.split('?')[0];
        }

        const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
    }

    questions.forEach((q, index) => {
        const videoUrl = q.video_url && typeof q.video_url === 'string' ? q.video_url : null;
        const isCorrect = selectedAnswers[index] === q.correct_answer;
        const resultText = isCorrect ? (lang === 'en' ? '✅ Correct' : '✅ Correto') : (lang === 'en' ? '❌ Incorrect' : '❌ Errado');

        const embedUrl = convertToEmbedUrl(videoUrl);

        const explanation = isCorrect
            ? ''
            : `<p>${lang === 'en' ? 'Correct Answer:' : 'Resposta Correta:'} ${q.correct_answer}</p>
               <p>${lang === 'en' ? 'Explanation:' : 'Explicação:'} ${q.explanation}</p>
               ${embedUrl ? `<iframe width="560" height="315" 
                   src="${embedUrl}" 
                   sandbox="allow-scripts allow-same-origin allow-forms allow-presentation" 
                   frameborder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowfullscreen>
               </iframe>` : `<p>${lang === 'en' ? 'Video not available' : 'Vídeo não disponível'}</p>`}`;
        
        const summaryItem = `
            <div class="summary-item">
                <h3>${lang === 'en' ? 'Question' : 'Questão'} ${index + 1}: ${q.question}</h3>
                <p>${lang === 'en' ? 'Your Answer:' : 'Sua Resposta:'} ${selectedAnswers[index]}</p>
                <p>${resultText}</p>
                ${explanation}
            </div>
        `;
        summaryContainer.innerHTML += summaryItem;
    });

    const scoreText = lang === 'en' ? `Your Final Score: ${score} points` : `Sua Pontuação Final: ${score} pontos`;
    const scoreItem = <div class="score-item"><h3>${scoreText}</h3></div>;
    summaryContainer.innerHTML += scoreItem;

    // Função para enviar pontuação para o servidor
    async function submitScore(user_id, quiz_id, score) {
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

    // Submeter pontuação
    const user_id = localStorage.getItem('userId');
    const quiz_id = questions.length > 0 ? questions[0].quiz_id : null;

    if (user_id && quiz_id) {
        submitScore(user_id, quiz_id, score);
    } else {
        console.error('Erro: user_id ou quiz_id não encontrados no localStorage.');
    }

    // Função de logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        alert('Você foi desconectado.');
        window.location.href = '../index/index.html';
    });

    document.getElementById('ranking-btn').innerText = lang === 'en' ? 'View Rankings' : 'Ver Ranking';
    document.getElementById('ranking-btn').addEventListener('click', () => {
        window.location.href = '../rankings/rankings.html';
    });

    document.getElementById('another-quiz-btn').innerText = lang === 'en' ? 'Take Another Quiz' : 'Fazer Outro Quiz';
    document.getElementById('another-quiz-btn').addEventListener('click', () => {
        window.location.href = '../quiz-selector/quiz-selector.html';
    });
});