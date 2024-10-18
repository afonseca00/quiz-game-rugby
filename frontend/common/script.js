document.addEventListener('DOMContentLoaded', () => {
    let currentLang = localStorage.getItem('lang') || 'pt';
    document.documentElement.lang = currentLang;
    updateLanguage(currentLang);

    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            localStorage.setItem('lang', currentLang);
            document.documentElement.lang = currentLang;
            updateLanguage(currentLang);
        });
    }
});

function updateLanguage(lang) {
    const flagElement = document.getElementById('flag');
    if (flagElement) {
        flagElement.src = lang === 'en' ? '../images/portugal.png' : '../images/england.png';
        flagElement.alt = lang === 'en' ? 'Portuguese' : 'English';
    }

    // Atualiza o texto dos links comuns no navbar
    document.querySelectorAll('a, button').forEach(el => {
        if (el.href && el.href.includes('login.html')) {
            el.innerText = lang === 'en' ? 'Login' : 'Entrar';
        }
        if (el.href && el.href.includes('register.html')) {
            el.innerText = lang === 'en' ? 'Register' : 'Registe-se';
        }
        if (el.href && el.href.includes('index.html')) {
            el.innerText = lang === 'en' ? 'Home' : 'Início';
        }
    });

    // Chama a função de atualização da página, se existir
    if (typeof updatePageLanguage === 'function') {
        updatePageLanguage(lang);
    }
}