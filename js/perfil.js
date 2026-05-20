// ===============================
// PERFIL.JS — Integração com auth.js e main.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ── Proteção: redireciona se não estiver logado ──
    // (reutiliza a função do auth.js que já está carregado)
    protegerPagina();

    const usuario = getUsuarioLogado();
    if (!usuario) return;

    // ── Dados do localStorage (main.js) ──
    const balanceSalvo = localStorage.getItem("ecoBalance");
    const missoesSalvas = localStorage.getItem("ecoMissions");

    const saldo = balanceSalvo ? parseFloat(balanceSalvo) : 12.50;
    const missoes = missoesSalvas ? JSON.parse(missoesSalvas) : [];

    // ── Avatar: iniciais do nome ──
    const avatarEl = document.getElementById("profile-avatar-initials");
    if (avatarEl) {
        const iniciais = usuario.user
            .split(" ")
            .map(p => p[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        avatarEl.textContent = iniciais || "?";
    }

    // ── Nome e e-mail (cabeçalho) ──
    const nomeEl = document.getElementById("profile-name");
    const emailEl = document.getElementById("profile-email");
    if (nomeEl) nomeEl.textContent = usuario.user;
    if (emailEl) emailEl.textContent = usuario.email || "E-mail não informado";

    // ── Nome e e-mail (card de dados) ──
    const nomeDetalhe = document.getElementById("profile-name-detail");
    const emailDetalhe = document.getElementById("profile-email-detail");
    if (nomeDetalhe) nomeDetalhe.textContent = usuario.user;
    if (emailDetalhe) emailDetalhe.textContent = usuario.email || "—";

    // ── Membro desde ──
    const sinceEl = document.getElementById("profile-since");
    if (sinceEl) {
        const dataCadastro = usuario.dataCadastro
            ? new Date(usuario.dataCadastro).toLocaleDateString("pt-BR")
            : "—";
        sinceEl.textContent = dataCadastro;
    }

    // ── Saldo ──
    const balanceEl = document.getElementById("profile-balance");
    if (balanceEl) {
        balanceEl.textContent = `R$ ${saldo.toFixed(2).replace(".", ",")}`;
    }

    // ── Missões concluídas ──
    const concluidas = missoes.filter(m => m.isCompleted);
    const missoesEl = document.getElementById("profile-missions");
    if (missoesEl) {
        missoesEl.textContent = concluidas.length;
    }

    // ── Nível baseado no número de missões concluídas ──
    const levelEl = document.getElementById("profile-level");
    if (levelEl) {
        levelEl.textContent = calcularNivel(concluidas.length);
    }

    // ── Sequência (streak): conta dias consecutivos com missão ──
    const streakEl = document.getElementById("profile-streak");
    if (streakEl) {
        streakEl.textContent = `${calcularStreak()} dias`;
    }

    // ── Passagens resgatadas (estimativa pelo saldo inicial - saldo atual) ──
    const PRECO_PASSAGEM = 4.40;
    const saldoInicial = 12.50; // valor padrão definido no main.js
    const passagens = Math.floor((saldoInicial - saldo < 0 ? 0 : saldoInicial - saldo) / PRECO_PASSAGEM);
    const redeemedEl = document.getElementById("profile-redeemed");
    if (redeemedEl) {
        redeemedEl.textContent = passagens;
    }

    // ── Histórico de missões recentes ──
    renderHistorico(concluidas);

    // ── Barra de progresso para próximo resgate ──
    atualizarProgresso(saldo, PRECO_PASSAGEM);
});


// ===============================
// FUNÇÕES AUXILIARES
// ===============================

function calcularNivel(qtd) {
    if (qtd === 0) return "Iniciante 🌱";
    if (qtd <= 5) return "Explorador 🌿";
    if (qtd <= 15) return "Guardião 🌳";
    if (qtd <= 30) return "Herói Verde 🏆";
    return "Lenda Sustentável 🌍";
}

function calcularStreak() {
    // Lê o streak salvo pelo main.js, ou retorna 0 se não existir
    const streak = localStorage.getItem("ecoStreak");
    return streak ? parseInt(streak) : 0;
}

function renderHistorico(concluidas) {
    const lista = document.getElementById("profile-history");
    if (!lista) return;

    // Se não há missões concluídas, mostra mensagem
    if (concluidas.length === 0) {
        lista.innerHTML = `
            <li style="text-align:center; padding: 2rem 0; color: var(--color-text-light); font-size: 0.9rem;">
                Nenhuma missão concluída ainda.<br>
                <a href="./missions.html" style="color: var(--color-primary); font-weight: 600;">
                    Começar agora →
                </a>
            </li>`;
        return;
    }

    // Pega as últimas 4 concluídas (mais recentes primeiro)
    const recentes = [...concluidas].reverse().slice(0, 4);

    lista.innerHTML = recentes.map(m => `
        <li class="profile-history-item">
            <span class="profile-history-icon">${m.emoji}</span>
            <div class="profile-history-info">
                <span class="profile-history-name">${m.title}</span>
                <span class="profile-history-date">Concluída</span>
            </div>
            <span class="profile-history-reward">+ R$ ${m.reward.toFixed(2).replace(".", ",")}</span>
        </li>
    `).join("");
}

function atualizarProgresso(saldo, preco) {
    // Quanto falta para completar mais uma passagem
    const resto = saldo % preco;
    const percentual = Math.min((resto / preco) * 100, 100);
    const falta = (preco - resto).toFixed(2).replace(".", ",");

    const fill = document.getElementById("profile-progress-fill");
    const current = document.getElementById("profile-progress-current");
    const hint = document.querySelector(".profile-progress-hint");

    if (fill) fill.style.width = `${percentual.toFixed(0)}%`;
    if (current) current.textContent = `R$ ${resto.toFixed(2).replace(".", ",")}`;
    if (hint) hint.innerHTML = `Faltam <strong>R$ ${falta}</strong> para sua próxima passagem! 🚌`;
}