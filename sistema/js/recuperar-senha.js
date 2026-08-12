/* ============================================================
   Tela de RECUPERAÇÃO DE SENHA.
   Não envia e-mail nenhum: só mostra uma mensagem de confirmação.
   Serve para termos uma segunda página e poder testar navegação.
   ============================================================ */

const campoEmailRecuperacao = document.getElementById("email-recuperacao");
const botaoEnviar = document.getElementById("btn-enviar");
const divSucesso = document.getElementById("mensagem-sucesso");

botaoEnviar.addEventListener("click", function () {
  const email = campoEmailRecuperacao.value.trim();

  if (email === "") {
    divSucesso.textContent = "";
    return;
  }

  divSucesso.textContent = "Link de recuperação enviado para " + email;
});
