// Usado pelo dashboard e pela página de produtos.

const usuarioLogado = sessionStorage.getItem("usuarioLogado");

// Sem sessão, volta para o login. Usamos replace() e não href para a
// página protegida não ficar no histórico do navegador.
if (!usuarioLogado) {
  window.location.replace("index.html");
}

const spanUsuario = document.getElementById("usuario-logado");
if (spanUsuario && usuarioLogado) {
  spanUsuario.textContent = usuarioLogado;
}

const botaoSair = document.getElementById("btn-sair");
if (botaoSair) {
  botaoSair.addEventListener("click", function () {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  });
}
