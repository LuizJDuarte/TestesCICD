// Comandos customizados. Quando uma sequência se repete em vários
// testes, ela vira um comando novo e passa a ser chamada igual aos
// comandos de fábrica do Cypress.
//
// Documentação: https://docs.cypress.io/api/cypress-api/custom-commands

Cypress.Commands.add("fazerLogin", (email, senha) => {
  const usuario = email || "admin@admin.com";
  const chave = senha || "123456";

  cy.visit("/index.html");
  cy.get("#email").type(usuario);
  cy.get("#senha").type(chave);
  cy.get("#btn-entrar").click();

  // Só termina depois que o painel abriu, para o teste não começar com
  // a página ainda carregando.
  cy.url().should("include", "dashboard.html");
});
