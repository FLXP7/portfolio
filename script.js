document.addEventListener('DOMContentLoaded', function() {

    // Adiciona sombra e cor sólida ao header ao rolar a página
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Rolagem suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Verifica se o link é apenas "#" para evitar quebrar a página
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

});

/* Script para o jogo da memória */
// Seleciona o elemento HTML onde vamos montar o tabuleiro do jogo
document.addEventListener('DOMContentLoaded', () => {
const stadiums = [
    { name: "maracanã", image: "estadio-maracana-2018-1.jpeg-696x464-1.jpg" },
    { name: "morumbi", image: "vista-aerea-estadio-morumbi.jpg" },
    { name: "pacaembu", image: "pacaembu_arena_mercado_livre_pagina.jpg" },
    { name: "caninde", image: "Estádio_do_Caninde.jpg" },
    { name: "mane_garrincha", image: "mane-garrincha.jpg" },
];

 let cards = [];
            let flippedCards = [];
            let matchedPairs = 0;
            let attempts = 0;
            let timerInterval;
            let seconds = 0;
            let gameStarted = false;
            
            const gameBoard = document.getElementById('game-board');
            const attemptsDisplay = document.getElementById('attempts');
            const matchesDisplay = document.getElementById('matches');
            const timerDisplay = document.getElementById('timer');
            const restartBtn = document.getElementById('restart-btn');
            const finalTimeDisplay = document.getElementById('final-time');
            const finalAttemptsDisplay = document.getElementById('final-attempts');
            const playAgainBtn = document.getElementById('play-again-btn');
            
            // Instanciação do Modal do Bootstrap
            const winModal = new bootstrap.Modal(document.getElementById('winModal'));
            
            function initGame() {
                const gameCards = [...stadiums, ...stadiums];
                gameCards.sort(() => Math.random() - 0.5);
                
                gameBoard.innerHTML = '';
                cards = [];
                flippedCards = [];
                matchedPairs = 0;
                attempts = 0;
                seconds = 0;
                gameStarted = false;
                
                attemptsDisplay.textContent = attempts;
                matchesDisplay.textContent = `${matchedPairs}/${stadiums.length}`;
                timerDisplay.textContent = '00:00';
                
                if (timerInterval) clearInterval(timerInterval);
                
                gameCards.forEach((stadium, index) => {
                    // Cada carta é uma coluna no grid do Bootstrap
                    const col = document.createElement('div');
                    col.className = 'col';

                    const cardEl = document.createElement('div');
                    cardEl.className = 'game-card'; // Usamos a classe 'game-card' para nossos estilos
                    cardEl.dataset.index = index;
                    
                    cardEl.innerHTML = `
                        <div class="card-inner">
                            <div class="card-front">
                                <i class="fas fa-futbol fa-3x mb-2"></i>
                                <span class="fw-semibold">Estádio</span>
                            </div>
                            <div class="card-back>
                                <img src="${stadium.image}" alt="${stadium.name}">
                                <div>
                                    ${stadium.name}
                                </div>
                            </div>
                        </div>
                    `;
                    
                    cardEl.addEventListener('click', flipCard);
                    col.appendChild(cardEl);
                    gameBoard.appendChild(col);
                    cards.push({ element: cardEl, stadium: stadium, matched: false });
                });
            }
            
            function flipCard() {
                if (!gameStarted) {
                    startTimer();
                    gameStarted = true;
                }
                
                const cardIndex = parseInt(this.dataset.index);
                const card = cards[cardIndex];
                
                if (card.element.classList.contains('flipped') || flippedCards.length === 2 || card.matched) {
                    return;
                }
                
                card.element.classList.add('flipped');
                flippedCards.push(card);
                
                if (flippedCards.length === 2) {
                    attempts++;
                    attemptsDisplay.textContent = attempts;
                    
                    const [card1, card2] = flippedCards;
                    
                    if (card1.stadium.name === card2.stadium.name) {
                        card1.matched = true;
                        card2.matched = true;
                        matchedPairs++;
                        matchesDisplay.textContent = `${matchedPairs}/${stadiums.length}`;
                        flippedCards = [];
                        
                        if (matchedPairs === stadiums.length) {
                            endGame();
                        }
                    } else {
                        setTimeout(() => {
                            card1.element.classList.remove('flipped');
                            card2.element.classList.remove('flipped');
                            flippedCards = [];
                        }, 1000);
                    }
                }
            }
            
            function startTimer() {
                timerInterval = setInterval(() => {
                    seconds++;
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
                }, 1000);
            }
            
            function endGame() {
                clearInterval(timerInterval);
                finalTimeDisplay.textContent = timerDisplay.textContent;
                finalAttemptsDisplay.textContent = attempts;
                
                // Mostra o modal de vitória usando o método do Bootstrap
                winModal.show();
                
                createConfetti();
            }
            
            function createConfetti() {
                const colors = ['#ff0000', '#ffffff', '#ffcc00', '#00ff00', '#0066ff'];
                for (let i = 0; i < 100; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = Math.random() * 2 + 's';
                    document.body.appendChild(confetti);
                    setTimeout(() => confetti.remove(), 5000);
                }
            }
            
            restartBtn.addEventListener('click', initGame);
            playAgainBtn.addEventListener('click', () => {
                // Esconde o modal usando o método do Bootstrap
                winModal.hide();
                initGame();
            });
            
            initGame();
        });