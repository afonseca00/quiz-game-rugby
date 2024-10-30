document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId'); // Obter o ID do utilizador

    // Atualizar informações do utilizador
    document.getElementById('update-info-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('https://localhost:5000/api/auth/update-info', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, fullName, email })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Informações atualizadas com sucesso!');
            } else {
                alert(`Erro: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar informações:', error);
            alert('Erro ao atualizar informações.');
        }
    });


    // Alterar password do utilizador
document.getElementById('change-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId'); // Verifique se o userId está presente
    console.log('userId:', userId); // Para verificar se o userId está disponível
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    // Verifica se os campos estão preenchidos corretamente
    if (!userId || !currentPassword || !newPassword) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

   if (!isPasswordStrong(newPassword)) {
        alert('A palavra-passe deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um símbolo (@$!%?&).');
        return;
    }

    try {
        const response = await fetch('https://quiz-game-rugby-ecdkbfh6ecgycybh.canadacentral-01.azurewebsites.net/api/auth/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Palavra-passe alterada com sucesso!');

            // Logout automático após a mudança de palavra-passe
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');

            // Redirecionar para a página de login
            window.location.href = '../login/login.html';
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro ao alterar palavra-passe:', error);
        alert('Erro ao alterar palavra-passe.');
    }
});

function isPasswordStrong(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    return regex.test(password);
}

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        alert('Logout com sucesso.');
        window.location.href = '../login/login.html';
    });
});