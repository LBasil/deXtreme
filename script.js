// Ciblage des éléments
const rollButton = document.getElementById('rollButton');
const dice = document.getElementById('dice');
const diceResult = document.getElementById('diceResult');
const playerHealthBar = document.getElementById('playerHealth');
const aiHealthBar = document.getElementById('aiHealth');
const betInput = document.getElementById('bet');
const comboCountElem = document.getElementById('comboCount');

// Ciblage des éléments de l'écran de fin
const endScreen = document.getElementById('endScreen');
const endMessage = document.getElementById('endMessage');
const summary = document.getElementById('summary');
const restartButton = document.getElementById('restartButton');

// Variables de santé
let playerHealth = 100;
let aiHealth = 100;
let comboCount = 0;  // Compteur de combos
let consecutiveWins = 0;  // Pour traquer les victoires consécutives
let bossFightActive = false;  // Boss fight flag

// Variables pour suivre les événements du jeu
let totalTurns = 0;
let totalDamageToAI = 0;
let totalDamageToPlayer = 0;

// Mise à jour des combos
function updateCombo(win) {
    if (win) {
        consecutiveWins++;
        comboCount = Math.min(consecutiveWins, 3); // Le combo max est de 3
    } else {
        consecutiveWins = 0;
        comboCount = 0;
    }

    comboCountElem.textContent = comboCount;
}

// Fonction pour générer un nombre aléatoire entre 1 et 6
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Fonction pour mettre à jour les barres de santé
function updateHealthBars() {
    playerHealthBar.style.width = playerHealth + '%';
    playerHealthBar.textContent = playerHealth + '%';
    aiHealthBar.style.width = aiHealth + '%';
    aiHealthBar.textContent = aiHealth + '%';

    if (playerHealth <= 0) {
        showEndScreen(false); // Défaite
    } else if (aiHealth <= 0) {
        showEndScreen(true); // Victoire
    } else if (aiHealth <= 30 && !bossFightActive) {
        triggerBossFight();
    }
}

// Fonction pour le boss fight
function triggerBossFight() {
    bossFightActive = true;
    alert("Boss Fight ! L'IA est enragée et attaque avec des dégâts doublés !");
    aiHealthBar.classList.add('bg-warning'); // Change la couleur de la barre de vie du Boss
}

// Fonction pour afficher l'écran de fin
function showEndScreen(playerWon) {
    const message = playerWon ? "Victoire !" : "Défaite...";
    const recap = `
        Nombre de tours : ${totalTurns}<br>
        Dégâts infligés à l'IA : ${totalDamageToAI}<br>
        Dégâts subis : ${totalDamageToPlayer}
    `;

    endMessage.textContent = message;
    summary.innerHTML = recap;
    endScreen.classList.remove('d-none');
}

// Fonction pour redémarrer le jeu
function restartGame() {
    playerHealth = 100;
    aiHealth = 100;
    totalTurns = 0;
    totalDamageToAI = 0;
    totalDamageToPlayer = 0;
    comboCount = 0;
    bossFightActive = false;

    updateHealthBars();
    comboCountElem.textContent = '0';
    diceResult.textContent = '-';
    endScreen.classList.add('d-none');
}

// Gestion du lancer de dé
rollButton.addEventListener('click', () => {
    const bet = parseInt(betInput.value);

    if (bet >= 1 && bet <= 10 && playerHealth > 0 && aiHealth > 0) {
        totalTurns++;
        dice.classList.add('dice-rolling');

        setTimeout(() => {
        const playerRoll = rollDice();
        const aiRoll = rollDice();

        diceResult.textContent = `Joueur : ${playerRoll} | IA : ${aiRoll}`;

        if (playerRoll > aiRoll) {
            const damageToAI = bet * (1 + comboCount * 0.5);
            aiHealth -= damageToAI;
            totalDamageToAI += damageToAI;
            updateCombo(true);
        } else if (aiRoll > playerRoll) {
            const damageToPlayer = bossFightActive ? bet * 2 : bet;
            playerHealth -= damageToPlayer;
            totalDamageToPlayer += damageToPlayer;
            updateCombo(false);
        }

        // Mettre à jour les barres de santé
        updateHealthBars();
        dice.classList.remove('dice-rolling');
        }, 500);
    } else {
        alert("Pari invalide ou jeu terminé !");
    }
});

// Gérer le clic sur le bouton "Recommencer"
restartButton.addEventListener('click', restartGame);
