// Função para atualizar o conteúdo dinâmico da página de resumo com base no idioma
function updatePageLanguage(lang) {
    console.log(`Atualizando idioma para: ${lang}`);
    const titleElement = document.querySelector('title');
    const h2Element = document.querySelector('#quiz-summary h2');
    const rankingButton = document.getElementById('ranking-btn');
    const anotherQuizButton = document.getElementById('another-quiz-btn');

    if (titleElement && h2Element && rankingButton && anotherQuizButton) {
        if (lang === 'en') {
            titleElement.innerText = 'Quiz Summary - Tackle Trivia';
            h2Element.innerText = 'Quiz Summary';
            rankingButton.innerText = 'View Ranking';
            anotherQuizButton.innerText = 'Take Another Quiz';
        } else {
            titleElement.innerText = 'Resumo do Quiz - Tackle Trivia';
            h2Element.innerText = 'Resumo do Quiz';
            rankingButton.innerText = 'Ver Ranking';
            anotherQuizButton.innerText = 'Fazer Outro Quiz';
        }

        console.log('Conteúdo atualizado:', {
            title: titleElement.innerText,
            header: h2Element.innerText,
            rankingButton: rankingButton.innerText,
            anotherQuizButton: anotherQuizButton.innerText,
        });
    } else {
        console.error("Um ou mais elementos não foram encontrados.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const lang = localStorage.getItem('language') || 'pt';  // Define o idioma padrão como 'pt' (português)
    updatePageLanguage(lang);

    const questions = JSON.parse(localStorage.getItem('quizQuestions'));
    const selectedAnswers = JSON.parse(localStorage.getItem('quizAnswers'));
    const score = localStorage.getItem('quizScore');

    console.log("Questões carregadas do localStorage:", questions);

    questions.forEach((q) => {
        console.log("Verificando dados carregados da questão:", q);
        if (!q.video_url) {
            console.warn("A questão não contém um video_url:", q.question);
        } else {
            console.log("URL do vídeo:", q.video_url);
        }
    });

    const summaryContainer = document.getElementById('summary-container');
    if (!summaryContainer) {
        console.error('Erro: summary-container não encontrado.');
        return;
    }

    summaryContainer.innerHTML = '';

    function convertToEmbedUrl(videoUrl) {
        if (!videoUrl) return null;
        const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
    }

    questions.forEach((q, index) => {
        const videoUrl = q.video_url && typeof q.video_url === 'string' ? q.video_url : null;
        const isCorrect = selectedAnswers[index] === q.correct_answer;
        
        const questionText = lang === 'en' ? `Question ${index + 1}` : `Questão ${index + 1}`;
        const yourAnswerText = lang === 'en' ? 'Your Answer' : 'Sua Resposta';
        const correctText = lang === 'en' ? '✅ Correct' : '✅ Correto';
        const incorrectText = lang === 'en' ? '❌ Incorrect' : '❌ Errado';
        const correctAnswerText = lang === 'en' ? 'Correct Answer' : 'Resposta Correta';
        const explanationText = lang === 'en' ? 'Explanation' : 'Explicação';
        
        const resultText = isCorrect ? correctText : incorrectText;
        const explanation = isCorrect
            ? ''
            : `<p>${correctAnswerText}: ${q.correct_answer}</p>
               <p>${explanationText}: ${q.explanation}</p>
               ${videoUrl ? `<iframe width="560" height="315" 
                   src="${convertToEmbedUrl(videoUrl)}" 
                   sandbox="allow-scripts allow-same-origin allow-forms allow-presentation" 
                   frameborder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowfullscreen>
               </iframe>` : `<p>${lang === 'en' ? 'Video not available' : 'Vídeo não disponível'}</p>`}`;

        const summaryItem = `
            <div class="summary-item">
                <h3>${questionText}: ${q.question}</h3>
                <p>${yourAnswerText}: ${selectedAnswers[index]}</p>
                <p>${resultText}</p>
                ${explanation}
            </div>
        `;
        summaryContainer.innerHTML += summaryItem;
    });

    const finalScoreText = lang === 'en' ? 'Your Final Score' : 'Sua Pontuação Final';
    const scoreItem = `
        <div class="score-item">
            <h3>${finalScoreText}: ${score} ${lang === 'en' ? 'points' : 'pontos'}</h3>
        </div>
    `;
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
        alert(lang === 'en' ? 'You have been logged out.' : 'Você foi desconectado.');
        window.location.href = '../index/index.html';
    });

    // Adicionando event listeners aos botões
    document.getElementById('ranking-btn').addEventListener('click', () => {
        window.location.href = '../rankings/rankings.html';
    });

    document.getElementById('another-quiz-btn').addEventListener('click', () => {
        window.location.href = '../quiz-selector/quiz-selector.html';
    });
});
