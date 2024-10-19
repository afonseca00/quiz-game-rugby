document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName'); // Obter o nome do usuário do localStorage
    const userId = localStorage.getItem('user_id'); // Obter o user_id do localStorage

    // Verifica se o usuário está logado
    if (!token) {
        alert('Você precisa fazer login primeiro!');
        window.location.href = '../login/login.html';
        return;
    }

    // Definir o nome do usuário real no dashboard
    if (userName) {
        document.getElementById('user-name').innerText = userName;
    } else {
        document.getElementById('user-name').innerText = 'Utilizador'; // Nome padrão se não houver nome armazenado
    }

    // Chama o backend para obter as estatísticas do usuário
    try {
        const response = await fetch(`http://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/quiz/user-stats?user_id=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Preenche os campos de estatísticas no dashboard
            document.getElementById('total-quizzes').innerText = data.quizzes_completed;
            document.getElementById('total-points').innerText = data.total_score;

            // Ranking pode ser obtido a partir de um endpoint específico para ranking ou calculado no backend
            const rankingResponse = await fetch(`https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/quiz/top-scores`);
            const rankingData = await rankingResponse.json();

            const userRank = rankingData.findIndex(item => item.username === userName) + 1;
            document.getElementById('current-ranking').innerText = userRank > 0 ? `#${userRank}` : 'N/A';
        } else {
            console.error('Erro ao obter estatísticas:', data.message);
        }
    } catch (error) {
        console.error('Erro ao se comunicar com o servidor:', error);
    }

    // Funções de redirecionamento
    document.getElementById('start-quiz-btn').addEventListener('click', () => {
        window.location.href = '../quiz-selector/quiz-selector.html';
    });

    document.getElementById('view-rankings-btn').addEventListener('click', () => {
        window.location.href = '../rankings/rankings.html';
    });

    document.getElementById('manage-account-btn').addEventListener('click', () => {
        window.location.href = '../account/manage-account.html';
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');  // Remove também o nome do usuário ao fazer logout
        alert('Você foi desconectado.');
        window.location.href = '../index/index.html';  // Redirecionar para index.html após logout
    });

    // Alternância de Tema (Escuro e Claro)
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.src = '../images/sun.png'; // Ícone de sol para modo claro
            themeIcon.alt = 'Modo Claro';
        } else {
            themeIcon.src = '../images/moon.png'; // Ícone de lua para modo escuro
            themeIcon.alt = 'Modo Escuro';
        }
    });

    // Alternância de Idioma
    const langToggle = document.getElementById('lang-toggle');
    const flagIcon = document.getElementById('flag-icon');

    langToggle.addEventListener('click', () => {
        const currentLang = localStorage.getItem('lang') || 'pt';
        const newLang = currentLang === 'pt' ? 'en' : 'pt';
        localStorage.setItem('lang', newLang);
        updateLanguage(newLang);
        updateFlag(newLang); // Atualizar a bandeira ao alternar o idioma
    });

    // Atualizar idioma da página ao carregar
    const currentLang = localStorage.getItem('lang') || 'pt';
    updateLanguage(currentLang);
    updateFlag(currentLang); // Define a bandeira inicial
});

// Função para atualizar o texto da página com base no idioma
function updateLanguage(lang) {
    const userNameElement = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const viewRankingsBtn = document.getElementById('view-rankings-btn');
    const manageAccountBtn = document.getElementById('manage-account-btn');
    const dashboardTitle = document.querySelector('.dashboard-content h2');

    // Atualizar os textos dos botões e saudação
    if (lang === 'en') {
        dashboardTitle.innerHTML = `Welcome to the Dashboard, <span id="user-name">${userNameElement.innerText}</span>`;
        logoutBtn.innerText = 'Logout';
        startQuizBtn.innerText = 'Start Quiz';
        viewRankingsBtn.innerText = 'View Rankings';
        manageAccountBtn.innerText = 'Manage Account';
    } else {
        dashboardTitle.innerHTML = `Bem-vindo ao Dashboard, <span id="user-name">${userNameElement.innerText}</span>`;
        logoutBtn.innerText = 'Sair';
        startQuizBtn.innerText = 'Iniciar Quiz';
        viewRankingsBtn.innerText = 'Ver Rankings';
        manageAccountBtn.innerText = 'Gerir Conta';
    }

    // Atualizar o conteúdo dos cards do dashboard
    updateDashboardCards(lang);
}

// Função para atualizar os textos dos cards do dashboard
function updateDashboardCards(lang) {
    const totalQuizzesCard = document.querySelector('.card h3[for="total-quizzes"]');
    const currentRankingCard = document.querySelector('.card h3[for="current-ranking"]');
    const totalPointsCard = document.querySelector('.card h3[for="total-points"]');

    if (lang === 'en') {
        totalQuizzesCard.innerText = 'Total Quizzes';
        currentRankingCard.innerText = 'Current Ranking';
        totalPointsCard.innerText = 'Total Points';
    } else {
        totalQuizzesCard.innerText = 'Total de Quizzes';
        currentRankingCard.innerText = 'Seu Ranking Atual';
        totalPointsCard.innerText = 'Total de Pontos';
    }
}

// Função para atualizar a bandeira com base no idioma
function updateFlag(lang) {
    const flagIcon = document.getElementById('flag-icon');
    
    if (lang === 'en') {
        flagIcon.src = '../images/portugal.png'; // Trocar para a bandeira de Portugal quando o idioma é inglês
        flagIcon.alt = 'Português';
    } else {
        flagIcon.src = '../images/england.png'; // Trocar para a bandeira da Inglaterra quando o idioma é português
        flagIcon.alt = 'English';
    }
}