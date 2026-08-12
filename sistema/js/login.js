/* ============================================================
   Tela de LOGIN.
   Sem framework, sem back-end, sem banco de dados.
   O objetivo da aula é TESTAR comportamento, não construir
   um sistema de autenticação de verdade.
   ============================================================ */

// Credenciais "corretas" do nosso sistema fake.
// (Em um sistema real isso NUNCA ficaria no front-end!)
const EMAIL_CORRETO = "admin@admin.com";
const SENHA_CORRETA = "123456";
const LIMITE_TENTATIVAS = 3;

// Contador em memória: volta a zero sempre que a página é recarregada.
let tentativasErradas = 0;

const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const botaoEntrar = document.getElementById("btn-entrar");
const divErro = document.getElementById("mensagem-erro");

function mostrarErro(texto) {
  divErro.textContent = texto;
}

botaoEntrar.addEventListener("click", function () {
  const email = campoEmail.value.trim();
  const senha = campoSenha.value;

  // Limpa o erro da tentativa anterior
  mostrarErro("");

  // Regra 1: campos obrigatórios
  if (email === "" || senha === "") {
    mostrarErro("Preencha o e-mail e a senha.");
    return;
  }

  // Regra 2: formato do e-mail (precisa ter @ e um ponto depois dele)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarErro("E-mail em formato inválido.");
    return;
  }

  // Regra 3: credenciais corretas -> guarda a sessão e entra
  if (email === EMAIL_CORRETO && senha === SENHA_CORRETA) {
    sessionStorage.setItem("usuarioLogado", email);
    window.location.href = "dashboard.html";
    return;
  }

  // Regra 4: errou. Conta a tentativa e bloqueia no limite.
  tentativasErradas = tentativasErradas + 1;

  if (tentativasErradas >= LIMITE_TENTATIVAS) {
    mostrarErro("Conta bloqueada após 3 tentativas.");
    botaoEntrar.disabled = true;
    return;
  }

  mostrarErro("E-mail ou senha inválidos.");
});

// Bônus: apertar "Enter" também tenta fazer o login.
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter" && !botaoEntrar.disabled) {
    botaoEntrar.click();
  }
});
