// Tela de login. Sem back-end: as credenciais ficam aqui mesmo,
// porque a ideia é ter algo simples de testar.

const EMAIL_CORRETO = "admin@admin.com";
const SENHA_CORRETA = "123456";
const LIMITE_TENTATIVAS = 3;

let tentativasErradas = 0;
let contaBloqueada = false;

const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const botaoEntrar = document.getElementById("btn-entrar");
const divErro = document.getElementById("mensagem-erro");

// O botão só libera com os dois campos preenchidos.
// Não usamos trim aqui: quem digitar só espaços na senha consegue clicar
// e recebe a mensagem de erro. (No campo de e-mail o navegador já
// descarta os espaços sozinho, porque ele é type="email".)
function atualizarBotao() {
  if (contaBloqueada) {
    return;
  }
  botaoEntrar.disabled = campoEmail.value === "" || campoSenha.value === "";
}

campoEmail.addEventListener("input", atualizarBotao);
campoSenha.addEventListener("input", atualizarBotao);
atualizarBotao();

botaoEntrar.addEventListener("click", function () {
  // O e-mail ignora espaços em volta e maiúsculas. A senha não:
  // ela é comparada exatamente como foi digitada.
  const email = campoEmail.value.trim().toLowerCase();
  const senha = campoSenha.value;

  divErro.textContent = "";

  if (email === "" || senha.trim() === "") {
    divErro.textContent = "Preencha o e-mail e a senha.";
    return;
  }

  // Precisa ter @ e um ponto depois dele.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    divErro.textContent = "E-mail em formato inválido.";
    return;
  }

  if (email === EMAIL_CORRETO && senha === SENHA_CORRETA) {
    sessionStorage.setItem("usuarioLogado", email);
    window.location.href = "dashboard.html";
    return;
  }

  tentativasErradas++;

  // Depois de bloqueada, a conta não volta: nem digitar a senha certa
  // reabilita o botão.
  if (tentativasErradas >= LIMITE_TENTATIVAS) {
    contaBloqueada = true;
    botaoEntrar.disabled = true;
    divErro.textContent = "Conta bloqueada após 3 tentativas.";
    return;
  }

  divErro.textContent = "E-mail ou senha inválidos.";
});

// Enter no teclado tem o mesmo efeito de clicar em Entrar.
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter" && !botaoEntrar.disabled) {
    botaoEntrar.click();
  }
});
