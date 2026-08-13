const SUPABASE_URL = 'https://sfwuyndcnomzuuzzmbhl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmd3V5bmRjbm9tenV1enptYmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NjY1ODIsImV4cCI6MjEwMjE0MjU4Mn0.Q-8v7OD6xCmmifMZ5AiBOebWz3khv9kHTKmmmhzzXA0';
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔒 E-MAILS DOS ADMINISTRADORES (Só aparece para vocês dois)
const EMAILS_ADMIN = [
    'marcoaandre7@gmail.com',
    'kayannesousanasc@gmail.com'
];

async function inicializarPagina() {
    // Busca a sessão do usuário atual
    const { data: { session } } = await clienteSupabase.auth.getSession();
    
    const linkAdmin = document.querySelector("#linkAdmin");
    const btnSair = document.querySelector("#btnSair"); // Se houver botão de sair na vitrine

    if (session && session.user) {
        const emailUsuario = session.user.email ? session.user.email.toLowerCase() : "";
        
        // Verifica se o e-mail logado pertence à lista de admins
        if (EMAILS_ADMIN.includes(emailUsuario)) {
            if (linkAdmin) {
                linkAdmin.style.display = "inline-block"; // MOSTRA o botão de admin
            }
        } else {
            if (linkAdmin) {
                linkAdmin.style.display = "none"; // Mantém oculto para usuários comuns
            }
        }
        
        if (btnSair) btnSair.style.display = "inline-block";
    } else {
        // Se ninguém estiver logado, esconde tudo
        if (linkAdmin) linkAdmin.style.display = "none";
        if (btnSair) btnSair.style.display = "none";
    }

    carregarProjetos();
}

// Chame a função ao carregar o script
inicializarPagina();