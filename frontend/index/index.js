function updatePageLanguage(lang) {
    document.querySelector('title').innerText = lang === 'en' ? 'Rugby Quiz Game' : 'Tackle Trivia';

    if (document.querySelector('.hero-content h2')) {
        document.querySelector('.hero-content h2').innerText = lang === 'en' ? 'Welcome to Rugby Quiz Game' : 'Bem-vindo ao Tackle Trivia';
        document.querySelector('.hero-content p').innerText = lang === 'en' ? 'Test your knowledge about Rugby with our interactive quiz game!' : 'Teste o seu conhecimento sobre Rugby com o nosso jogo de quiz interativo!';
    }

    if (document.getElementById('start-now-btn')) {
        document.getElementById('start-now-btn').innerText = lang === 'en' ? 'Start Now' : 'Começar Agora';
    }

    if (document.getElementById('about-btn')) {
        document.getElementById('about-btn').innerText = lang === 'en' ? 'About' : 'Sobre';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentLang = localStorage.getItem('lang') || 'pt';
    updatePageLanguage(currentLang);

    document.body.classList.add('loaded'); // Adiciona a classe para ativar a transição suave
});