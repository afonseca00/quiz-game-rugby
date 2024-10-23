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

    // Gerar o resumo das perguntas e respostas
    questions.forEach((q, index) => {
        const isCorrect = selectedAnswers[index] === q.correct_answer;
        const resultText = isCorrect ? '✅ Correto' : '❌ Errado';
        const explanationHTML = isCorrect ? '' : `<p>Resposta Correta: ${q.correct_answer}</p><p>Explicação: ${q.explanation}</p>`;

        const summaryItem = document.createElement('div');
        summaryItem.classList.add('summary-item');
        summaryItem.innerHTML = `
            <h3>Questão ${index + 1}: ${q.question}</h3>
            <p>Sua Resposta: ${selectedAnswers[index]}</p>
            <p>${resultText}</p>
            ${explanationHTML}
        `;

        // Verifica se há um vídeo associado e adiciona o iframe
        if (!isCorrect && q.video_url) {
            const iframe = document.createElement('iframe');
            iframe.width = '560';
            iframe.height = '315';
            iframe.src = q.video_url;
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            summaryItem.appendChild(iframe);
        }

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

// Lógica de logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('Você foi desconectado.');
    window.location.href = '../index/index.html';
});