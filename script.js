let hor = 0;
let min = 0;
let seg = 0;
let id;
let left = 0;

var paused = true;

const playerDiv = document.querySelector("#player-div");
const naveDiv = document.querySelector("#nave-id");
const missileContainer = document.querySelector(".missile-container");
const missileDiv1 = document.querySelector("#missile1");
const missileDiv2 = document.querySelector("#missile2");
const timer = document.querySelector("#timer-text");

let missile1Active = false;
let missile2Active = false;
let missile1Fired = false;
let missile2Fired = false;

function add() {
    seg++;
    if (seg === 60) {
        seg = 0;
        min++;
    }
    if (min === 60) {
        min = 0;
        hor++;
    }

    let textoHora = String(hor).padStart(2, "0");
    let textoMin = String(min).padStart(2, "0");
    let textoSeg = String(seg).padStart(2, "0");

    timer.textContent = `${textoHora}:${textoMin}:${textoSeg}`;
}

function resume() {
    if (paused === true) {
        document.querySelector("#pause-screen").style.display = "none";
        id = setInterval(add, 1000);
        paused = false;
        missileDiv1.style.animationPlayState = missile1Fired ? 'running' : 'running';
        missileDiv2.style.animationPlayState = missile2Fired ? 'running' : 'running';
    } else {
        missileDiv1.style.animationPlayState = 'running';
        missileDiv2.style.animationPlayState = 'running';
    }
}

function pause() {
    if (paused === false) {
        document.querySelector("#pause-screen").style.display = "flex";
        clearInterval(id);
        paused = true;
        missileDiv1.style.animationPlayState = 'paused';
        missileDiv2.style.animationPlayState = 'paused';
    }
}

function resumelose() {
    if (paused === true) {
        document.querySelector("#lose-screen").style.display = "none";
        id = setInterval(add, 1000);
        paused = false;
        missileDiv1.style.animationPlayState = missile1Fired ? 'running' : 'running';
        missileDiv2.style.animationPlayState = missile2Fired ? 'running' : 'running';
    } else {
        missileDiv1.style.animationPlayState = 'running';
        missileDiv2.style.animationPlayState = 'running';
    }
}

function youlose() {
    if (paused === false) {
        document.querySelector("#lose-screen").style.display = "flex";
        clearInterval(id);
        paused = true;
        missileDiv1.style.animationPlayState = 'paused';
        missileDiv2.style.animationPlayState = 'paused';
    }
}

document.addEventListener("keydown", function (e) {
    if (e.key === "p" || e.key === "P") {
        if (paused) {
            resume();
        } else {
            pause();
        }
    }
});

document.addEventListener("keydown", function (e) {
    if (paused === true) return;

    const step = 60;
    const screenWidth = window.innerWidth;
    const naveWidth = naveDiv.offsetWidth;

    left = parseFloat(window.getComputedStyle(naveDiv).left) || 0;

    if (e.key === "ArrowLeft" && left > 0) {
        left = Math.max(0, left - step);
    }

    if (e.key === "ArrowRight" && left + naveWidth < screenWidth) {
        left = Math.min(screenWidth - naveWidth, left + step);
    }
    naveDiv.style.left = `${left}px`;

    missileDirection(left, naveWidth);
});

function missileDirection(direction, naveWidth) {
    if (!missile1Fired) {
        missileDiv1.style.left = `${direction + naveWidth / 2 - missileDiv1.offsetWidth / 2}px`;
    }
    if (!missile2Fired) {
        missileDiv2.style.left = `${direction + naveWidth / 2 - missileDiv2.offsetWidth / 2}px`;
    }
}

function shootMissile(missileDiv, isActive, fired) {
    if (paused || isActive || fired) return true;

    const naveLeft = parseFloat(window.getComputedStyle(naveDiv).left);
    const naveWidth = naveDiv.offsetWidth;
    const missileLeft = naveLeft + naveWidth / 2 - missileDiv.offsetWidth / 2;

    missileDiv.style.left = `${missileLeft}px`;
    missileDiv.style.top = `${naveDiv.offsetTop}px`;

    // Força reinício da animação
    missileDiv.style.animation = 'none';
    missileDiv.offsetHeight;
    missileDiv.style.animation = "missile-shoot 1s linear forwards";

    return true;
}

function resetMissile(missileDiv) {
    missileDiv.style.animation = '';
    missileDiv.style.top = '';
}

document.addEventListener("keydown", function (e) {
    if (paused) return;

    if (e.key === " ") {
        if (!missile1Fired) {
            missile1Fired = shootMissile(missileDiv1, missile1Active, missile1Fired);
            missile1Active = true;
        } else if (!missile2Fired) {
            missile2Fired = shootMissile(missileDiv2, missile2Active, missile2Fired);
            missile2Active = true;
        }
    }
});

missileDiv1.addEventListener('animationend', function () {
    missile1Active = false;
});

missileDiv2.addEventListener('animationend', function () {
    missile2Active = false;
    if (missile1Fired) { // Check if missile 1 was fired
        resetMissile(missileDiv1);
        resetMissile(missileDiv2);
        missile1Fired = false;
        missile2Fired = false;
    }
});

const enemyClass = document.querySelector('.enemy-class');

function createAlien(id) {
    const alienContainer = document.createElement('div');
    alienContainer.id = id;
    alienContainer.classList.add('alien-container');

    const alienImg = document.createElement('img');
    alienImg.classList.add('enemy-img-class');
    alienImg.src = 'images/alien.png';

    alienContainer.appendChild(alienImg);
    enemyClass.appendChild(alienContainer);
}

createAlien('alien1-id');
createAlien('alien2-id');
createAlien('alien3-id');

const alienElement = document.querySelector('.enemy-class');
const alienScoreText = document.getElementById('alien-text');
const naveLifeText = document.getElementById('nave-text');

let alienScore = 0;
let naveLife = 3;

function updateDisplay() {
    alienScoreText.textContent = `ALIEN: ${alienScore}`;
    naveLifeText.textContent = `LIFE: ${naveLife}`;
}

function resetAlienAnimation() {
    alienElement.style.animation = 'none'; // Remove a animação
    alienElement.style.top = '-300px'; // Reseta a posição
    void alienElement.offsetWidth; // Força um reflow
    alienElement.style.animation = 'descend 2s forwards'; // Reinicia a animação
}

function alienAttack() {
    alienScore++;
    updateDisplay();
    naveLife--; // Diminui a vida da nave
    updateNaveLife(); // Atualiza a vida na tela

    if (naveLife <= 0) {
        gameOver(); // Se a vida acabar, Game Over
    } else {
        youlose();
        setTimeout(function () {
            resumelose();
            resetAlienAnimation(); // Reinicia a animação
        }, 3000);


    }
}

function gameOver() {
    document.querySelector("#game-over-screen").style.display = "flex";
    clearInterval(id);
    paused = true;
    missileDiv1.style.animationPlayState = 'paused';
    missileDiv2.style.animationPlayState = 'paused';
}

alienElement.addEventListener('animationend', () => {
    alienAttack();
});

function updateNaveLife() {
    naveLifeText.textContent = `LIFE: ${naveLife}`;
}


updateDisplay();
updateNaveLife(); // Inicializa a vida na tela

function myFunction() {
    var x = 1 + 1;
}

const missile1 = document.getElementById('missile1');
const missile2 = document.getElementById('missile2');
let alien1 = document.getElementById('alien1-id');
let alien2 = document.getElementById('alien2-id');
let alien3 = document.getElementById('alien3-id');

// Function to check for collision between two elements
function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left);
}

// Function to handle missile-alien collision
function handleMissileAlienCollision(missile, alien) {
    if (checkCollision(missile, alien)) {
        // Remove both missile and alien
        // missile.remove();
        alien.remove();

        // Update the alien score
        alienScore++;
        updateDisplay();

        // Reset missile state
        if (missile.id === 'missile1') {
            missile1Fired = false;
            missile1Active = false;
        } else if (missile.id === 'missile2') {
            missile2Fired = false;
            missile2Active = false;
        }
    }
}

// Main game loop to check for collisions
function gameLoop() {
    if (missile1Fired) handleMissileAlienCollision(missile1, alien1);
    if (missile1Fired) handleMissileAlienCollision(missile1, alien2);
    if (missile1Fired) handleMissileAlienCollision(missile1, alien3);
    if (missile2Fired) handleMissileAlienCollision(missile2, alien1);
    if (missile2Fired) handleMissileAlienCollision(missile2, alien2);
    if (missile2Fired) handleMissileAlienCollision(missile2, alien3);

    if (!document.getElementById('alien1-id') &&
        !document.getElementById('alien2-id') &&
        !document.getElementById('alien3-id')) {
        resetAlienAnimation();
        // Recria os aliens para o próximo ataque
        createAlien('alien1-id');
        createAlien('alien2-id');
        createAlien('alien3-id');

        // Reatribui as variáveis
        alien1 = document.getElementById('alien1-id');
        alien2 = document.getElementById('alien2-id');
        alien3 = document.getElementById('alien3-id');
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();