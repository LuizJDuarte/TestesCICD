// Não envia e-mail nenhum, só confirma na tela.
// Serve para termos outra página e poder testar navegação.

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
