// Função específica para atualizar o conteúdo dinâmico da página About
function updatePageLanguage(lang) {
    if (lang === 'en') {
        document.querySelector('title').innerText = 'About Tackle Trivia';
        if (document.querySelector('.hero-content h2')) {
            document.querySelector('.hero-content h2').innerText = 'About Tackle Trivia';
            document.querySelector('.about-text').innerHTML = `
                <p>Tackle Trivia was born from my passion for rugby, a sport I started playing at the age of 13. Since then, I have had the honor of representing the national rugby team on several occasions, where I developed values such as teamwork, discipline, and strategy.</p>
                <p>This project represents a blend of my programming skills and my passion for rugby. Designed for both rugby fans and those who want to learn more about the sport, the game offers an interactive and educational experience. When players make a mistake, small explanatory texts and videos are presented to help them understand the rules and nuances of rugby.</p>
                <p>In addition, Tackle Trivia features a ranking system where players can compete and see who is at the top of the leaderboards, motivating everyone to improve their knowledge and skills in the game.</p>
            `;
        }
    } else {
        document.querySelector('title').innerText = 'Sobre o Tackle Trivia';
        if (document.querySelector('.hero-content h2')) {
            document.querySelector('.hero-content h2').innerText = 'Sobre o Tackle Trivia';
            document.querySelector('.about-text').innerHTML = `
                <p>O Tackle Trivia nasceu da minha paixão pelo rugby, um desporto que comecei a praticar aos 13 anos. Desde então, tive a honra de representar a seleção nacional de rugby em várias ocasiões, onde desenvilvi valores como o trabalho em equipa, disciplina e estratégia.</p>
                <p>Este projeto representa um misto das minhas habilidades em programação assim como a minha paixão pelo rugby. Construído a pensar tanto nos fãs de rugby como naqueles que querem aprender mais sobre o desporto, o jogo oferece uma experiência interativa e educativa. Quando os jogadores cometem um erro, são apresentados pequenos textos explicativos e vídeos para ajudar na compreensão das regras e nuances do rugby.</p>
                <p>Além disso, o Tackle Trivia conta com um sistema de rankings, onde os jogadores podem competir e ver quem está no topo das classificações, motivando todos a melhorar os seus conhecimentos e habilidades no jogo.</p>
            `;
        }
    }
}