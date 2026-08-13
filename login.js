const SUPABASE_URL = 'https://sfwuyndcnomzuuzzmbhl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmd3V5bmRjbm9tenV1enptYmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NjY1ODIsImV4cCI6MjEwMjE0MjU4Mn0.Q-8v7OD6xCmmifMZ5AiBOebWz3khv9kHTKmmmhzzXA0';
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔒 E-MAILS DOS ADMINISTRADORES
const EMAILS_ADMIN = [
    'marcoaandre7@gmail.com',
    'kayannesousanasc@gmail.com'
];

let modoCadastro = false; // Controla se está logando ou criando conta

const tituloForm = document.querySelector("#tituloForm");
const btnAcao = document.querySelector("#btnAcao");
const textoAlternativo = document.querySelector("#textoAlternativo");
const linkAlternar = document.querySelector("#linkAlternar");
const formLogin = document.querySelector("#formLogin");
const mensagemStatus = document.querySelector("#mensagemStatus");

// Alternar dinamicamente entre "Entrar" e "Criar Conta"
linkAlternar.addEventListener("click", (e) => {
    e.preventDefault();
    modoCadastro = !modoCadastro;
    
    if (modoCadastro) {
        if (tituloForm) tituloForm.innerText = "Criar Nova Conta";
        if (btnAcao) btnAcao.innerText = "Cadastrar";
        if (textoAlternativo) {
            textoAlternativo.innerHTML = `Já tem uma conta? <a href="#" id="linkAlternar" style="color: #38bdf8; text-decoration: none; font-weight: bold;">Fazer Login</a>`;
        }
    } else {
        if (tituloForm) tituloForm.innerText = "Acessar Painel";
        if (btnAcao) btnAcao.innerText = "Entrar";
        if (textoAlternativo) {
            textoAlternativo.innerHTML = `Não tem uma conta? <a href="#" id="linkAlternar" style="color: #38bdf8; text-decoration: none; font-weight: bold;">Criar Conta</a>`;
        }
    }
    
    if (mensagemStatus) mensagemStatus.innerText = "";
});

// Delegação de evento para o link alternar (caso recrie o elemento no DOM)
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "linkAlternar") {
        e.preventDefault();
        // Dispara o clique do link alternar novamente de forma limpa
        linkAlternar.click();
    }
});

// Ação de Envio do Formulário (Login ou Cadastro)
if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const emailInput = document.querySelector("#email");
        const senhaInput = document.querySelector("#senha");

        if (!emailInput || !senhaInput) return;

        const email = emailInput.value.trim();
        const senha = senhaInput.value; // Mantido sem .trim() para preservar espaços se houver na senha

        if (mensagemStatus) {
            mensagemStatus.style.color = "#f8fafc";
            mensagemStatus.innerText = "Processando...";
        }

        if (modoCadastro) {
            // Fluxo de Cadastro
            const { data, error } = await clienteSupabase.auth.signUp({ email, senha });

            if (error) {
                if (mensagemStatus) {
                    mensagemStatus.style.color = "#ef4444";
                    mensagemStatus.innerText = "Erro ao cadastrar: " + error.message;
                }
            } else {
                if (mensagemStatus) {
                    mensagemStatus.style.color = "#38bdf8";
                    mensagemStatus.innerText = "Conta criada com sucesso! Redirecionando...";
                }
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } else {
            // Fluxo de Login
            const { data, error } = await clienteSupabase.auth.signInWithPassword({ email, senha });

            if (error) {
                if (mensagemStatus) {
                    mensagemStatus.style.color = "#ef4444";
                    mensagemStatus.innerText = "E-mail ou senha incorretos.";
                }
            } else {
                if (mensagemStatus) {
                    mensagemStatus.style.color = "#38bdf8";
                    mensagemStatus.innerText = "Login realizado com sucesso! Redirecionando...";
                }
                
                const emailUsuario = data.session.user.email.toLowerCase();

                // Se for Administrador, manda para o admin.html. Se não, manda para a vitrine projeto.html
                setTimeout(() => {
                    if (EMAILS_ADMIN.includes(emailUsuario)) {
                        window.location.href = "admin.html";
                    } else {
                        window.location.href = "projeto.html";
                    }
                }, 1000);
            }
        }
    });
}