document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DEL LANZADOR DE EPIC GAMES ---
    const epicClient = document.getElementById('epic-client');
    const navLinks = document.querySelectorAll('.main-nav a');
    const views = document.querySelectorAll('.view');

    function setupLauncher() {
        const initialActiveLink = document.querySelector('.main-nav a.active');
        if (initialActiveLink) {
            const initialViewId = initialActiveLink.dataset.view + '-view';
            document.getElementById(initialViewId)?.classList.add('active');
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetViewId = link.dataset.view + '-view';
                const targetView = document.getElementById(targetViewId);
                if (!targetView) return;

                navLinks.forEach(l => l.classList.remove('active'));
                views.forEach(v => v.classList.remove('active'));

                link.classList.add('active');
                targetView.classList.add('active');
            });
        });
    }
    setupLauncher();

    // --- LÓGICA PARA INICIAR Y CERRAR EL JUEGO ---
    const gameContainer = document.getElementById('game-container');
    const launchSnakeBtn = document.getElementById('launch-snake-game');
    const backToLauncherBtn = document.getElementById('back-to-launcher-btn');

    launchSnakeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        epicClient.style.display = 'none'; // Oculta el lanzador
        gameContainer.style.display = 'flex'; // Muestra el juego
        startGame(); // Inicia la lógica del juego
    });

    backToLauncherBtn.addEventListener('click', () => {
        stopGame(); // Detiene el bucle del juego
        gameContainer.style.display = 'none'; // Oculta el juego
        epicClient.style.display = 'flex'; // Muestra el lanzador
    });

    // --- LÓGICA DEL JUEGO DE LA SERPIENTE (SNAKE) ---
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');

    // Nuevos elementos para la pantalla de Game Over
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreElement = document.getElementById('final-score');
    const retryBtn = document.getElementById('retry-btn');

    const gridSize = 20;
    let canvasSize = 600;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    let snake, food, score, direction, gameLoop;
    let changingDirection = false;

    function startGame() {
        snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
        score = 0;
        direction = { x: gridSize, y: 0 }; // Mover a la derecha al inicio

        gameOverScreen.style.display = 'none';

        scoreElement.textContent = score;
        generateFood();
        
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(main, 100); // Velocidad del juego
        
        document.addEventListener('keydown', changeDirection);
    }
    
    function stopGame() {
        clearInterval(gameLoop);
        document.removeEventListener('keydown', changeDirection);
    }

    // Nueva función para mostrar la pantalla de Game Over
    function showGameOverScreen() {
        finalScoreElement.textContent = score;
        gameOverScreen.style.display = 'flex';
    }

    // Event listener para el botón de reintentar
    retryBtn.addEventListener('click', () => {
        startGame(); // Simplemente reinicia el juego
    });

    function main() {
        changingDirection = false;
        if (didGameEnd()) {
            stopGame();
            showGameOverScreen();
            return;
        }
        
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
    }

    function clearCanvas() {
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        snake.forEach(part => {
            ctx.fillStyle = '#0078f2'; // Color de la serpiente
            ctx.strokeStyle = '#121212'; // Borde de la serpiente
            ctx.fillRect(part.x, part.y, gridSize, gridSize);
            ctx.strokeRect(part.x, part.y, gridSize, gridSize);
        });
    }

    function moveSnake() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
        // Si la comida aparece en la serpiente, generar de nuevo
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) generateFood();
        });
    }

    function drawFood() {
        ctx.fillStyle = '#ff4757'; // Color de la comida
        ctx.strokeStyle = '#f5f5f5';
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
        ctx.strokeRect(food.x, food.y, gridSize, gridSize);
    }

    function changeDirection(event) {
        if (changingDirection) return;
        changingDirection = true;

        const GOING_UP = direction.y === -gridSize;
        const GOING_DOWN = direction.y === gridSize;
        const GOING_RIGHT = direction.x === gridSize;
        const GOING_LEFT = direction.x === -gridSize;

        if (event.key === 'ArrowUp' && !GOING_DOWN) direction = { x: 0, y: -gridSize };
        if (event.key === 'ArrowDown' && !GOING_UP) direction = { x: 0, y: gridSize };
        if (event.key === 'ArrowLeft' && !GOING_RIGHT) direction = { x: -gridSize, y: 0 };
        if (event.key === 'ArrowRight' && !GOING_LEFT) direction = { x: gridSize, y: 0 };
    }

    function didGameEnd() {
        // Colisión con sigo misma
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
        }
        // Colisión con las paredes
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= canvas.width;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= canvas.height;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }
});