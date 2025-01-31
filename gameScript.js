document.getElementById('startGameButton').addEventListener('click', function() {
    const gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.style.display = 'block';
    startGame(gameCanvas);
});

function startGame(gameCanvas) {
    let cookieCount = 0;
    let autoClickerCount = 0;
    let autoClickerInterval = 2000;
    let gameStarted = false;

    const cookie = document.getElementById("cookie");
    const scoreDisplay = document.getElementById("score");
    const buyAutoClickerButton = document.getElementById("buyAutoClicker");

    gameStarted = true;
    cookie.style.display = "block";

    cookie.addEventListener("click", function () {
        if (gameStarted) {
            cookieCount++;
            scoreDisplay.textContent = `Cookies: ${cookieCount}`;
        }
    });

    buyAutoClickerButton.addEventListener("click", function () {
        if (cookieCount >= 30) {
            cookieCount -= 30;
            autoClickerCount++;
            scoreDisplay.textContent = `Cookies: ${cookieCount}`;
            startAutoClicker();
        }
    });

    function startAutoClicker() {
        setInterval(function () {
            if (autoClickerCount > 0) {
                cookieCount += autoClickerCount;
                scoreDisplay.textContent = `Cookies: ${cookieCount}`;
            }
        }, autoClickerInterval);
    }

    const upgradeAutoClickerButton = document.getElementById("upgradeAutoClicker");
    upgradeAutoClickerButton.addEventListener("click", function () {
        if (cookieCount >= 50) {
            cookieCount -= 50;
            autoClickerInterval = Math.max(100, autoClickerInterval - 500);
            scoreDisplay.textContent = `Cookies: ${cookieCount}`;
        }
    });
}
