const SUPABASE_URL = 'https://sfwuyndcnomzuuzzmbhl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmd3V5bmRjbm9tenV1enptYmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NjY1ODIsImV4cCI6MjEwMjE0MjU4Mn0.Q-8v7OD6xCmmifMZ5AiBOebWz3khv9kHTKmmmhzzXA0';

const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔒 E-MAILS DE QUEM É ADMIN
const EMAILS_ADMIN = [
    'marcoaandre7@gmail.com',
    'kayannesousanasc@gmail.com'
];

// Elementos do HTML
const secaoLogin = document.querySelector("#secaoLogin");
const secaoLeitor = document.querySelector("#secaoLeitor");
const secaoPainel = document.querySelector("#secaoPainel");

const formLogin = document.querySelector("#formLogin");
const formProjeto = document.querySelector("#formProjeto");

const btnCriarConta = document.querySelector("#btnCriarConta");
const btnsSair = document.querySelectorAll(".btnSair");

const mensagemLogin = document.querySelector("#mensagemLogin");
const mensagemProjeto = document.querySelector("#mensagemProjeto");

// --- 1. VERIFICAR QUEM ESTÁ LOGADO ---
async function checarSessao() {
    const { data: { session } } = await clienteSupabase.auth.getSession();

    if (!session) {
        // Ninguém logado -> Mostra formulário de login
        if (secaoLogin) secaoLogin.style.display = "block";
        if (secaoLeitor) secaoLeitor.style.display = "none";
        if (secaoPainel) secaoPainel.style.display = "none";
        return;
    }

    // Normaliza para letras minúsculas
    const emailUsuario = session.user.email.toLowerCase();

    // Se for Admin (Marco ou Kayanne)
    if (EMAILS_ADMIN.includes(emailUsuario)) {
        if (secaoLogin) secaoLogin.style.display = "none";
        if (secaoLeitor) secaoLeitor.style.display = "none";
        if (secaoPainel) secaoPainel.style.display = "block";
    } else {
        // Se for Usuário Comum -> Redireciona direto para ver os projetos
        window.location.href = "projeto.html";
    }
}

// --- 2. FAZER LOGIN ---
if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        mensagemLogin.textContent = "Autenticando...";
        mensagemLogin.style.color = "black";

        const email = document.querySelector("#email").value.trim().toLowerCase();
        const senha = document.querySelector("#senha").value;

        const { data, error } = await clienteSupabase.auth.signInWithPassword({
            email: email,
            password: senha
        });

        if (error) {
            mensagemLogin.textContent = "Erro ao entrar: " + error.message;
            mensagemLogin.style.color = "red";
        } else {
            mensagemLogin.textContent = "Login com sucesso!";
            mensagemLogin.style.color = "green";
            checarSessao();
        }
    });
}

// --- 3. CRIAR CONTA SOZINHO (VISITANTES) ---
if (btnCriarConta) {
    btnCriarConta.addEventListener("click", async () => {
        const email = document.querySelector("#email").value.trim().toLowerCase();
        const senha = document.querySelector("#senha").value;

        if (!email || !senha) {
            mensagemLogin.textContent = "Preencha e-mail e senha para criar a conta!";
            mensagemLogin.style.color = "red";
            return;
        }

        mensagemLogin.textContent = "Criando conta...";
        mensagemLogin.style.color = "black";

        const { data, error } = await clienteSupabase.auth.signUp({
            email: email,
            password: senha
        });

        if (error) {
            mensagemLogin.textContent = "Erro ao criar conta: " + error.message;
            mensagemLogin.style.color = "red";
        } else {
            mensagemLogin.textContent = "Conta criada com sucesso! Redirecionando...";
            mensagemLogin.style.color = "green";
            checarSessao();
        }
    });
}

// --- 4. CADASTRAR PROJETO (APENAS ADMINS) ---
if (formProjeto) {
    formProjeto.addEventListener("submit", async (e) => {
        e.preventDefault();
        mensagemProjeto.textContent = "Salvando projeto...";
        mensagemProjeto.style.color = "black";

        const novoProjeto = {
            titulo: document.querySelector("#titulo").value,
            categoria: document.querySelector("#categoria").value,
            imagem_url: document.querySelector("#imagem_url").value,
            descricao: document.querySelector("#descricao").value
        };

        const { data, error } = await clienteSupabase
            .from('projeto')
            .insert([novoProjeto]);

        if (error) {
            mensagemProjeto.textContent = "Erro ao salvar: " + error.message;
            mensagemProjeto.style.color = "red";
        } else {
            mensagemProjeto.textContent = "Projeto cadastrado com sucesso!";
            mensagemProjeto.style.color = "green";
            formProjeto.reset();
        }
    });
}

// --- 5. LOGOUT (SAIR) ---
btnsSair.forEach(btn => {
    btn.addEventListener("click", async () => {
        await clienteSupabase.auth.signOut();
        checarSessao();
    });
});

// Inicializa a checagem ao carregar a página
checarSessao();