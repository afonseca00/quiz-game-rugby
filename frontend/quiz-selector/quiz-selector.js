document.addEventListener('DOMContentLoaded', () => {
    // Alternância de Idioma
    const langToggle = document.getElementById('lang-toggle');
    const flagIcon = document.getElementById('flag-icon');

    langToggle.addEventListener('click', () => {
        const currentLang = localStorage.getItem('lang') || 'pt';
        const newLang = currentLang === 'pt' ? 'en' : 'pt';
        localStorage.setItem('lang', newLang);
        updateLanguage(newLang);
        updateFlag(newLang);
    });

    // Atualiza a página com o idioma atual ao carregar
    const currentLang = localStorage.getItem('lang') || 'pt';
    updateLanguage(currentLang);
    updateFlag(currentLang);

    // Funções para redirecionar para o quiz correto com o idioma selecionado
    document.getElementById('history-quiz-btn').addEventListener('click', () => {
        const lang = localStorage.getItem('lang') || 'pt'; // Obtém o idioma atual
        window.location.href = `../quiz/quiz.html?category=history&lang=${lang}`; // Passa o idioma como parâmetro na URL
    });

    document.getElementById('rules-quiz-btn').addEventListener('click', () => {
        const lang = localStorage.getItem('lang') || 'pt'; // Obtém o idioma atual
        window.location.href = `../quiz/quiz.html?category=rules&lang=${lang}`; // Passa o idioma como parâmetro na URL
    });

    document.getElementById('general-quiz-btn').addEventListener('click', () => {
        const lang = localStorage.getItem('lang') || 'pt'; // Obtém o idioma atual
        window.location.href = `../quiz/quiz.html?category=general&lang=${lang}`; // Passa o idioma como parâmetro na URL
    });

    // Função para logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Logout com sucesso.');
        window.location.href = '../login/login.html';
    });

    // Funções auxiliares
    function updateLanguage(lang) {
        const headerText = document.querySelector('h2');
        if (lang === 'en') {
            headerText.innerText = 'Choose Quiz Type';
            document.getElementById('history-quiz-btn').innerText = 'Rugby History';
            document.getElementById('rules-quiz-btn').innerText = 'Rugby Rules';
            document.getElementById('general-quiz-btn').innerText = 'General';
        } else {
            headerText.innerText = 'Escolha o Tipo de Quiz';
            document.getElementById('history-quiz-btn').innerText = 'História do Rugby';
            document.getElementById('rules-quiz-btn').innerText = 'Regras do Rugby';
            document.getElementById('general-quiz-btn').innerText = 'Geral';
        }
    }

    function updateFlag(lang) {
        if (lang === 'en') {
            flagIcon.src = '../images/portugal.png';
            flagIcon.alt = 'Português';
        } else {
            flagIcon.src = '../images/england.png';
            flagIcon.alt = 'English';
        }
    }
});