/* ============================================================
   Controle de SESSÃO — usado pelas páginas internas
   (dashboard.html e produtos.html).

   Faz duas coisas:
     1. Se ninguém fez login, chuta o visitante de volta para o login.
     2. Mostra o e-mail de quem entrou no cabeçalho.

   É isso que permite testar: "área restrita não pode ser
   acessada sem login".
   ============================================================ */

const usuarioLogado = sessionStorage.getItem("usuarioLogado");

// 1. Porteiro: sem sessão, volta para a tela de login
if (!usuarioLogado) {
  window.location.href = "index.html";
}

// 2. Mostra o e-mail no cabeçalho
const spanUsuario = document.getElementById("usuario-logado");
if (spanUsuario && usuarioLogado) {
  spanUsuario.textContent = usuarioLogado;
}

// 3. Botão "Sair": apaga a sessão e volta para o login
const botaoSair = document.getElementById("btn-sair");
if (botaoSair) {
  botaoSair.addEventListener("click", function () {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  });
}
