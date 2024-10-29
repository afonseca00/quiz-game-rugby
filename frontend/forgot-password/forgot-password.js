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

    // Lógica de envio de requisição ao backend para recuperação de palavra-passe
    document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifier = document.getElementById('identifier').value;

        try {
            // Fazer uma requisição para o backend
            const response = await fetch('https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/auth/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: identifier }) // Enviar o identificador (email ou username) para o backend
            });

            const result = await response.json();

            if (response.ok) {
                // Exibir mensagem de sucesso
                alert(result.message);
            } else {
                // Exibir mensagem de erro
                alert(`Erro: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro ao tentar recuperar palavra-passe:', error);
            alert('Ocorreu um erro ao tentar recuperar a palavra-passe. Tente novamente mais tarde.');
        }
    });
});