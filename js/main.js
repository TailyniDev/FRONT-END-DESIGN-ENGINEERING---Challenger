const missionsData = [
    {
        id: 1,
        title: "Caminhe 1.000 passos",
        description: "Troque o carro pelas calçadas por 15 minutos.",
        reward: 0.75,
        emoji: "🚶",
        isCompleted: false
    },
    {
        id: 2,
        title: "Leia sobre Mobilidade Verde",
        description: "Acesse um artigo sobre transporte sustentável no app.",
        reward: 0.50,
        emoji: "📚",
        isCompleted: false
    },
    {
        id: 3,
        title: "Compartilhe uma carona",
        description: "Registre uma carona solidária com um amigo.",
        reward: 1.20,
        emoji: "🚗",
        isCompleted: false
    },
    {
        id: 4,
        title: "Recicle uma garrafa",
        description: "Escaneie o código da reciclagem na estação SoulUp.",
        reward: 0.90,
        emoji: "♻️",
        isCompleted: false
    }
];

let missions = [];
let userBalance = 12.50;

function loadData() {
    const savedMissions = localStorage.getItem("ecoMissions");
    const savedBalance = localStorage.getItem("ecoBalance");

    missions = savedMissions ? JSON.parse(savedMissions) : JSON.parse(JSON.stringify(missionsData));
    userBalance = savedBalance ? parseFloat(savedBalance) : 12.50;
}

function saveData() {
    localStorage.setItem("ecoMissions", JSON.stringify(missions));
    localStorage.setItem("ecoBalance", userBalance.toFixed(2));
}

function updateBalance() {
    const balanceElement = document.getElementById("userBalance");
    if (balanceElement) {
        balanceElement.innerText = `R$ ${userBalance.toFixed(2)}`;
    }
}

function renderMissions() {
    const missionsGrid = document.getElementById("missionsGrid");
    if (!missionsGrid) return;

    missionsGrid.innerHTML = "";

    missions.forEach((mission) => {
        const missionCard = document.createElement("div");
        missionCard.className = "mission-card";

        missionCard.innerHTML = `
            <span class="mission-emoji">${mission.emoji}</span>
            <h3>${mission.title}</h3>
            <p>${mission.description}</p>
            <div class="mission-reward">💰 +R$ ${mission.reward.toFixed(2)}</div>
            <button class="complete-mission" data-id="${mission.id}" ${mission.isCompleted ? "disabled" : ""}>
                ${mission.isCompleted ? "✓ Concluída" : "Completar Missão"}
            </button>
        `;

        missionsGrid.appendChild(missionCard);
    });

    document.querySelectorAll(".complete-mission").forEach((btn) => {
        btn.addEventListener("click", () => {
            completeMission(parseInt(btn.dataset.id));
        });
    });
}

function completeMission(id) {
    const mission = missions.find((m) => m.id === id);
    if (!mission || mission.isCompleted) return;

    mission.isCompleted = true;
    userBalance += mission.reward;

    saveData();
    renderMissions();
    updateBalance();

    alert(`Missão concluída! Você ganhou R$ ${mission.reward.toFixed(2)}`);
}

function setupRedeem() {
    const redeemBtn = document.getElementById("redeemBtn");
    const redeemMessage = document.getElementById("redeemMessage");

    if (!redeemBtn || !redeemMessage) return;

    redeemBtn.addEventListener("click", () => {
        const ticketPrice = 4.40;

        if (userBalance >= ticketPrice) {
            userBalance -= ticketPrice;
            saveData();
            updateBalance();

            redeemMessage.innerHTML = `
                <p style="color: green; margin-top: 1rem;">
                    ✅ Resgate realizado com sucesso!
                </p>
            `;
        } else {
            redeemMessage.innerHTML = `
                <p style="color: red; margin-top: 1rem;">
                    ❌ Saldo insuficiente para resgatar a passagem.
                </p>
            `;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    renderMissions();
    updateBalance();
    setupRedeem();
});