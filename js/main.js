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

let userBalance = 12.50;

function renderMissions() {
    const missionsGrid = document.getElementById("missionsGrid");

    missionsGrid.innerHTML = "";

    missionsData.forEach(mission => {
        const missionCard = document.createElement("div");

        missionCard.classList.add("mission-card");

        missionCard.innerHTML = `
            <span>${mission.emoji}</span>
            <h3>${mission.title}</h3>
            <p>${mission.description}</p>

            <strong>💰 R$ ${mission.reward.toFixed(2)}</strong>

            <br><br>

            <button 
                class="complete-btn"
                data-id="${mission.id}"
                ${mission.isCompleted ? "disabled" : ""}
            >
                ${mission.isCompleted ? "✓ Concluída" : "Completar missão"}
            </button>
        `;

        missionsGrid.appendChild(missionCard);
    });

    addMissionEvents();
}

function addMissionEvents() {
    const buttons = document.querySelectorAll(".complete-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const missionId = Number(button.dataset.id);

            completeMission(missionId);
        });
    });
}

function completeMission(id) {
    const mission = missionsData.find(m => m.id === id);

    if (!mission || mission.isCompleted) return;

    mission.isCompleted = true;

    userBalance += mission.reward;

    alert(
        `Missão concluída!\nVocê ganhou R$ ${mission.reward.toFixed(2)}`
    );

    renderMissions();

    updateBalance();
}

function updateBalance() {
    const balanceText = document.getElementById("userBalance");

    if (balanceText) {
        balanceText.innerText = `R$ ${userBalance.toFixed(2)}`;
    }
}

function setupRedeem() {
    const redeemBtn = document.getElementById("redeemBtn");
    const redeemMessage = document.getElementById("redeemMessage");

    redeemBtn.addEventListener("click", () => {
        const ticketPrice = 4.40;

        if (userBalance >= ticketPrice) {
            userBalance -= ticketPrice;

            updateBalance();

            redeemMessage.innerHTML = `
                <p>✅ Passagem resgatada com sucesso!</p>
            `;
        } else {
            redeemMessage.innerHTML = `
                <p>❌ Saldo insuficiente.</p>
            `;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderMissions();
    updateBalance();
    setupRedeem();
});
