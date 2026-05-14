const missionsData = [
    {
        id: 1,
        title: "Caminhe 1.000 passos",
        description: "Troque o carro pelas calçadas por 15 minutos.",
        reward: 0.75,
        emoji: "🚶"
    },
    {
        id: 2,
        title: "Leia sobre Mobilidade Verde",
        description: "Acesse um artigo sobre transporte sustentável no app.",
        reward: 0.50,
        emoji: "📚"
    },
    {
        id: 3,
        title: "Compartilhe uma carona",
        description: "Registre uma carona solidária com um amigo.",
        reward: 1.20,
        emoji: "🚗"
    },
    {
        id: 4,
        title: "Recicle uma garrafa",
        description: "Escaneie o código da reciclagem na estação SoulUp.",
        reward: 0.90,
        emoji: "♻️"
    }
];

function renderMissions() {
    const missionsGrid = document.getElementById("missionsGrid");

    missionsData.forEach(mission => {
        const missionCard = document.createElement("div");

        missionCard.classList.add("mission-card");

        missionCard.innerHTML = `
            <span>${mission.emoji}</span>
            <h3>${mission.title}</h3>
            <p>${mission.description}</p>
            <strong>💰 R$ ${mission.reward.toFixed(2)}</strong>
            <br><br>
            <button>Completar missão</button>
        `;

        missionsGrid.appendChild(missionCard);
    });
}

document.addEventListener("DOMContentLoaded", renderMissions);