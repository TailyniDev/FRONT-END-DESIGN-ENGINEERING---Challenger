const API_URL = "http://127.0.0.1:3000";

// LOCALSTORAGE

// Retorna o objeto do usuário logado, ou null se não houver sessão
function getUsuarioLogado() {
    try {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    } catch {
        return null;
    }
}

function salvarUsuario(usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
}

function removerUsuario() {
    localStorage.removeItem("usuarioLogado");
}

// Retorna true se houver um usuário salvo na sessão
function estaLogado() {
    return !!getUsuarioLogado();
}

// REQUISIÇÕES

// Busca dados de qualquer endpoint da API (ex: "logins", "adms")
async function buscarDados(endpoint) {
    const response = await fetch(`${API_URL}/${endpoint}`);

    if (!response.ok) {
        throw new Error(`Erro ao buscar ${endpoint}`);
    }

    return response.json();
}

// INTERFACE

// Atualiza o header conforme o estado de login:
// - Logado: exibe nome, botão sair, links de Missões e Perfil
// - Deslogado: exibe botão de Login
function atualizarUIUsuario() {
    const usuario = getUsuarioLogado();

    const authButtons = document.getElementById("auth-buttons");
    const userMenu    = document.getElementById("user-menu");
    const userDisplay = document.getElementById("user-display");
    const navMissions = document.getElementById("nav-missions");
    const navProfile  = document.getElementById("nav-profile");

    if (usuario) {
        if (authButtons) authButtons.style.display = "none";
        if (userMenu)    userMenu.style.display    = "flex";
        if (userDisplay) userDisplay.textContent   = `Olá, ${usuario.user}`;
        if (navMissions) navMissions.style.display = "list-item";
        if (navProfile)  navProfile.style.display  = "list-item";
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userMenu)    userMenu.style.display    = "none";
        if (navMissions) navMissions.style.display = "none";
        if (navProfile)  navProfile.style.display  = "none";
    }
}

// REDIRECIONAMENTO

// Se o usuário já estiver logado e tentar acessar login ou cadastro,
// redireciona direto para a página de missões
function redirecionarSeLogado() {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    const paginaAtual  = window.location.pathname;
    const paginasAuth  = ["login.html", "cadastro.html"];
    const estaPaginaAuth = paginasAuth.some(page => paginaAtual.includes(page));

    if (estaPaginaAuth) {
        window.location.href = "missions.html";
    }
}

// LOGOUT

function logout() {
    const confirmar = confirm("Tem certeza que deseja sair?");
    if (!confirmar) return;

    removerUsuario();
    alert("Você saiu da conta.");
    window.location.href = "index.html";
}

// PROTEÇÃO DE PÁGINAS

// Bloqueia o acesso a páginas que exigem login.
// Chame essa função no topo das páginas protegidas (ex: perfil.js, missions)
function protegerPagina() {
    const usuario = getUsuarioLogado();

    if (!usuario) {
        alert("Faça login para acessar.");
        window.location.href = "login.html";
    }
}

// LOGIN

async function login(user, senha) {
    if (!user || !senha) {
        alert("Preencha usuário e senha.");
        return;
    }

    try {
        const usuarios = await buscarDados("logins");

        // Busca usuário com user e senha correspondentes
        const usuario = usuarios.find(u =>
            u.user === user && u.senha === senha
        );

        if (!usuario) {
            alert("Usuário ou senha inválidos.");
            return;
        }

        salvarUsuario(usuario);
        window.location.href = "missions.html";

    } catch (erro) {
        console.error("Erro no login:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
}

// CADASTRO


async function registrar(user, senha, email, telefone) {
    if (!user || !senha || !email) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const usuarios = await buscarDados("logins");

        // Impede cadastro duplicado por username ou e-mail
        const usuarioExiste = usuarios.find(u =>
            u.user === user || u.email === email
        );

        if (usuarioExiste) {
            alert("Usuário já cadastrado.");
            return;
        }

        const response = await fetch(`${API_URL}/logins`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user,
                senha,
                email,
                telefone: telefone || ""
            })
        });

        if (!response.ok) throw new Error("Erro ao cadastrar");

        alert("Cadastro realizado.");
        window.location.href = "login.html";

    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        alert("Erro ao conectar com servidor.");
    }
}

// INICIALIZAÇÃO


document.addEventListener("DOMContentLoaded", () => {
    atualizarUIUsuario();
    redirecionarSeLogado();

    // Formulário de login
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        formLogin.addEventListener("submit", event => {
            event.preventDefault();

            const user  = document.getElementById("login-user").value.trim();
            const senha = document.getElementById("login-senha").value;

            login(user, senha);
        });
    }

    // Formulário de cadastro
    const formRegistro = document.getElementById("form-registro");
    if (formRegistro) {
        formRegistro.addEventListener("submit", event => {
            event.preventDefault();

            const user     = document.getElementById("registro-user").value.trim();
            const senha    = document.getElementById("registro-senha").value;
            const email    = document.getElementById("registro-email").value.trim();
            const telefone = document.getElementById("telefone")?.value.trim();

            registrar(user, senha, email, telefone);
        });
    }
});