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
let userBalance = 0;

// ── Chaves do localStorage  ──
function getChaveBalance() {
    const usuario = getUsuarioLogado();
    return usuario ? `ecoBalance_${usuario.user}` : "ecoBalance_guest";
}

function getChaveMissions() {
    const usuario = getUsuarioLogado();
    return usuario ? `ecoMissions_${usuario.user}` : "ecoMissions_guest";
}

function getChavePassagens() {
    const usuario = getUsuarioLogado();
    return usuario ? `ecoPassagens_${usuario.user}` : "ecoPassagens_guest";
}

// ── Carregar dados do usuário atual ──
function loadData() {
    const savedMissions = localStorage.getItem(getChaveMissions());
    const savedBalance = localStorage.getItem(getChaveBalance());

    missions = savedMissions ? JSON.parse(savedMissions) : JSON.parse(JSON.stringify(missionsData));
    userBalance = savedBalance ? parseFloat(savedBalance) : 0;
}

// ── Salvar dados do usuário atual ──
function saveData() {
    localStorage.setItem(getChaveMissions(), JSON.stringify(missions));
    localStorage.setItem(getChaveBalance(), userBalance.toFixed(2));
}

// ── Atualizar saldo na tela ──
function updateBalance() {
    const balanceElement = document.getElementById("userBalance");
    if (balanceElement) {
        balanceElement.innerText = `R$ ${userBalance.toFixed(2).replace(".", ",")}`;
    }
}

// ── Renderizar cards de missão ──
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
            <div class="mission-reward">💰 +R$ ${mission.reward.toFixed(2).replace(".", ",")}</div>
            <button class="${mission.isCompleted ? "completed" : "btn-primary"} complete-mission"
                    data-id="${mission.id}"
                    ${mission.isCompleted ? "disabled" : ""}>
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

// ── Completar missão ──
function completeMission(id) {
    const mission = missions.find((m) => m.id === id);
    if (!mission || mission.isCompleted) return;

    mission.isCompleted = true;
    userBalance += mission.reward;

    saveData();
    renderMissions();
    updateBalance();

    alert(`Missão concluída! Você ganhou R$ ${mission.reward.toFixed(2).replace(".", ",")}`);
}

// ── Resgate de passagem ──
function setupRedeem() {
    const redeemBtn = document.getElementById("redeemBtn");
    const redeemMessage = document.getElementById("redeemMessage");

    if (!redeemBtn || !redeemMessage) return;

    redeemBtn.addEventListener("click", () => {
        const ticketPrice = 4.40;

        if (userBalance >= ticketPrice) {
            userBalance -= ticketPrice;

            // Incrementa contador de passagens resgatadas
            const chavePassagens = getChavePassagens();
            const totalPassagens = parseInt(localStorage.getItem(chavePassagens) || "0") + 1;
            localStorage.setItem(chavePassagens, totalPassagens);

            saveData();
            updateBalance();

            redeemMessage.innerHTML = `
                <p style="color: var(--color-success); margin-top: 1rem; font-weight: 600;">
                    ✅ Resgate realizado! Passagens resgatadas: ${totalPassagens}
                </p>`;
        } else {
            const falta = (4.40 - userBalance).toFixed(2).replace(".", ",");
            redeemMessage.innerHTML = `
                <p style="color: var(--color-error); margin-top: 1rem; font-weight: 600;">
                    ❌ Saldo insuficiente. Faltam R$ ${falta}.
                </p>`;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    renderMissions();
    updateBalance();
    setupRedeem();
});


// ── CPF ──
const cpfInput = document.getElementById("cpf");
if (cpfInput) {
    cpfInput.addEventListener("input", function (e) {
        e.target.value = e.target.value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
    });
}

// ── Telefone ──
const phoneMask = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
};

const handlePhone = (event) => {
    event.target.value = phoneMask(event.target.value);
};