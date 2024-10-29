document.addEventListener('DOMContentLoaded', async () => {
    let currentQuestionIndex = 0;
    let selectedAnswers = [];
    let questions = [];
    let score = 0; // Variável para armazenar a pontuação

    // Obtém o valor da categoria da URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    // Mapeia a categoria para o ID correspondente no banco de dados
    const categoryMap = {
        'history': 1,
        'rules': 2,
        'general': 3
    };
    
    const categoryId = categoryMap[category];

    if (!categoryId) {
        alert('Categoria inválida ou não especificada.');
        return;
    }

    // Função para buscar perguntas da API
    async function fetchQuestions(categoryId) {
        try {
            // Obtem o idioma atual (por exemplo, do localStorage ou de uma configuração)
            const currentLang = localStorage.getItem('lang') || 'pt'; // Pode ser 'pt' ou 'en'
            
            const response = await fetch(`https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/quiz/questions?category_id=${categoryId}&language=${currentLang}`);
            
            const data = await response.json();
            if (response.ok && data.length > 0) {
                return data.slice(0, 5); // Retorna no máximo 5 perguntas
            } else {
                throw new Error('Erro ao carregar perguntas ou perguntas não disponíveis.');
            }
        } catch (error) {
            console.error('Erro ao carregar perguntas:', error);
            alert('Erro ao carregar perguntas. Tente novamente mais tarde.');
            return null;
        }
    }

    // Função para embaralhar perguntas
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Carregar perguntas quando a página é carregada
    questions = await fetchQuestions(categoryId);
    
    if (!questions || questions.length === 0) {
        alert('Nenhuma pergunta disponível para essa categoria.');
        return; // Sai se não houver perguntas
    }

    // Salva o quiz_id no localStorage
    const quizId = questions[0].quiz_id;
    localStorage.setItem('quizId', quizId);  // Armazena o quiz_id no localStorage
    console.log(`Quiz ID armazenado: ${quizId}`);

    // Embaralha as perguntas e limita a 5
    questions = shuffleArray(questions);

    // Inicializa o array de respostas selecionadas
    selectedAnswers = Array(questions.length).fill(null);

    // Função para carregar uma pergunta com base no índice atual
    function loadQuestion(index) {
        const questionData = questions[index];
        document.getElementById('current-question').innerText = index + 1;
        document.getElementById('question-text').innerText = questionData.question;
        
        const optionsButtons = document.querySelectorAll('.quiz-option');
        const allOptions = [questionData.correct_answer, questionData.option_1, questionData.option_2, questionData.option_3];
    
        // Faz com que a resposta correta não fique sempre na mesma posição
        const shuffledOptions = shuffleArray(allOptions);
    
        optionsButtons.forEach((btn, idx) => {
            btn.innerText = shuffledOptions[idx];
            btn.classList.remove('selected');
            if (selectedAnswers[index] === shuffledOptions[idx]) {
                btn.classList.add('selected');
            }
        });
    
        // Controlar visibilidade dos botões de navegação
        document.getElementById('prev-question-btn').style.display = index === 0 ? 'none' : 'inline-block';
        document.getElementById('next-question-btn').innerText = index === questions.length - 1 ? 'Submeter' : 'Próxima Questão';
    }

    // Função para calcular a pontuação
    function calculateScore() {
        score = 0; // Reinicia a pontuação
        questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correct_answer) {
                score += 10; // Cada resposta correta vale 10 pontos
            }
        });
    }

    // Função para redirecionar para a página de resumo
    function goToSummaryPage() {
        // Armazena a pontuação e as respostas no localStorage
        localStorage.setItem('quizScore', score);
        localStorage.setItem('quizAnswers', JSON.stringify(selectedAnswers));
        localStorage.setItem('quizQuestions', JSON.stringify(questions));

        // Redireciona para a página de resumo
        window.location.href = '../resumo/resumo.html'; // Corrigir caminho conforme necessário
    }

    // Navegação entre questões
    document.getElementById('next-question-btn').addEventListener('click', () => {
        if (selectedAnswers[currentQuestionIndex] == null) {
            alert('Por favor, selecione uma resposta antes de continuar.');
            return;
        }
        
        if (currentQuestionIndex === questions.length - 1) {
            calculateScore(); // Calcula a pontuação ao finalizar o quiz
            goToSummaryPage(); // Redireciona para a página de resumo
        } else {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        }
    });

    document.getElementById('prev-question-btn').addEventListener('click', () => {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    });

    // Selecionar resposta
    document.querySelectorAll('.quiz-option').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const selectedOption = e.target.innerText;
            
            // Atualiza a resposta selecionada para a questão atual
            selectedAnswers[currentQuestionIndex] = selectedOption;

            // Remove a classe 'selected' de todos os botões e adiciona ao botão clicado
            document.querySelectorAll('.quiz-option').forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });

    // Reiniciar quiz
    document.getElementById('retake-quiz-btn').addEventListener('click', () => {
        // Reinicia o quiz embaralhando novamente as perguntas
        selectedAnswers = Array(questions.length).fill(null);
        currentQuestionIndex = 0;
        questions = shuffleArray(questions); // Embaralha novamente as perguntas
        document.querySelector('.quiz-container').classList.remove('hidden');
        document.getElementById('quiz-summary').classList.add('hidden');
        loadQuestion(0);
    });

    loadQuestion(0); // Carrega a primeira questão ao abrir a página
});

// Lógica de logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logout com sucesso.');
    window.location.href = '../login/login.html';
});