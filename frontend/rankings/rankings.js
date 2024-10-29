document.addEventListener('DOMContentLoaded', () => {
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

    const langToggle = document.getElementById('lang-toggle');
    langToggle.addEventListener('click', () => {
        const currentLang = localStorage.getItem('lang') || 'pt';
        const newLang = currentLang === 'pt' ? 'en' : 'pt';
        localStorage.setItem('lang', newLang);
        updateLanguage(newLang);
    });

    const currentLang = localStorage.getItem('lang') || 'pt';
    updateLanguage(currentLang);

    // Função para buscar o ranking e atualizar a página
    async function fetchAndDisplayRanking() {
        try {
            const response = await fetch('https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/quiz/top-scores');
            if (!response.ok) {
                throw new Error('Erro ao buscar o ranking.');
            }
            const rankingData = await response.json();

            // Atualiza a lista de ranking no DOM
            const rankingList = document.querySelector('.ranking-list');
            rankingList.innerHTML = ''; // Limpa a lista anterior

            rankingData.forEach((player, index) => {
                const rankingItem = `
                    <li class="ranking-item">
                        <div class="ranking-position">#${index + 1}</div>
                        <div class="player-name">${player.username}</div>
                        <div class="player-score">${player.total_score} pontos</div>
                    </li>
                `;
                rankingList.innerHTML += rankingItem; // Adiciona o item ao HTML
            });
        } catch (error) {
            console.error('Erro ao exibir o ranking:', error);
        }
    }

    // Função para atualizar o idioma da página
    function updateLanguage(lang) {
        const rankingTitle = document.getElementById('ranking-title');
        if (lang === 'en') {
            rankingTitle.innerText = 'Ranking';
        } else {
            rankingTitle.innerText = 'Ranking';
        }
    }

    // Buscar e exibir o ranking ao carregar a página
    fetchAndDisplayRanking();
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logout com sucesso.');
    window.location.href = '../index/index.html';
});