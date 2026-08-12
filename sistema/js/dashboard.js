/* ============================================================
   Tela do DASHBOARD.

   Quase tudo aqui é HTML estático (os cartões de resumo).
   O controle de sessão e o botão "Sair" ficam em js/sessao.js,
   porque são compartilhados com a página de produtos.
   ============================================================ */

console.log("Dashboard carregado para:", sessionStorage.getItem("usuarioLogado"));
