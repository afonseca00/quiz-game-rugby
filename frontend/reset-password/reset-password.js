document.addEventListener('DOMContentLoaded', () => {
    // Função para obter o token da URL
    function getTokenFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token'); // Obtém o token da URL
    }

    const token = getTokenFromUrl();
    if (!token) {
        alert('Token de redefinição de senha não encontrado.');
        return;
    }

    document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        try {
            const response = await fetch('https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token, // Envia o token obtido da URL
                    newPassword
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = '../login/login.html'; // Redireciona para o login após a redefinição
            } else {
                alert(`Erro: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro ao redefinir palavra-passe:', error);
            alert('Ocorreu um erro ao tentar redefinir a senha. Tente novamente mais tarde.');
        }
    });
});