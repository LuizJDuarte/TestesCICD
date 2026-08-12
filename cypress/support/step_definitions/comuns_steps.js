// ============================================================
//  PASSOS COMUNS
//
//  Passos que servem para QUALQUER tela do sistema: navegar,
//  clicar em link, conferir texto, conferir link, conferir botão.
//
//  Escrever passos genéricos assim é o que faz o Cucumber valer
//  a pena: o próximo cenário que você criar já vai ter metade
//  dos passos prontos.
// ============================================================

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ------------------------------------------------------------
//  GIVEN — preparar a situação inicial
// ------------------------------------------------------------

Given("que eu estou logado no sistema", () => {
  // Fazemos o login de verdade, pela tela, como um usuário faria.
  cy.visit("/index.html");
  cy.get("#email").type("admin@admin.com");
  cy.get("#senha").type("123456");
  cy.get("#btn-entrar").click();

  // Só continua depois que o dashboard realmente abriu
  cy.url().should("include", "dashboard.html");
});

Given("que eu encerrei minha sessão", () => {
  // Apaga a "carteirinha" que o sistema guardou no navegador
  cy.window().then((janela) => janela.sessionStorage.clear());
});

// ------------------------------------------------------------
//  WHEN — as ações do usuário
// ------------------------------------------------------------

When("eu acesso diretamente a página {string}", (pagina) => {
  cy.visit("/" + pagina);
});

When("eu clico no link {string}", (textoDoLink) => {
  // cy.contains("a", texto) = "ache o link cujo texto é esse"
  cy.contains("a", textoDoLink).click();
});

When("eu clico no botão {string}", (textoDoBotao) => {
  cy.contains("button", textoDoBotao).click();
});

// ------------------------------------------------------------
//  THEN — as verificações
// ------------------------------------------------------------

Then("eu devo ser redirecionado para {string}", (pagina) => {
  cy.url().should("include", pagina);
});

Then("eu devo ver o título {string}", (titulo) => {
  cy.get("h1").should("be.visible").and("have.text", titulo);
});

Then("eu devo ver o texto {string}", (texto) => {
  // Procura o texto em QUALQUER lugar da página
  cy.contains(texto).should("be.visible");
});

// --- Verificações de LINK -----------------------------------

Then("o link {string} deve apontar para {string}", (textoDoLink, destino) => {
  // have.attr = "esse elemento tem o atributo href com esse valor exato"
  cy.contains("a", textoDoLink).should("have.attr", "href", destino);
});

Then("o link {string} deve conter {string} no endereço", (textoDoLink, pedaco) => {
  // Aqui conferimos só um PEDAÇO do endereço.
  // Útil para links externos e longos, que mudam com o tempo.
  cy.contains("a", textoDoLink)
    .should("have.attr", "href")
    .and("include", pedaco);
});

Then("o link {string} deve abrir em uma nova aba", (textoDoLink) => {
  cy.contains("a", textoDoLink).should("have.attr", "target", "_blank");
});

// --- Verificações de BOTÃO ----------------------------------

Then("o botão {string} deve estar habilitado", (textoDoBotao) => {
  cy.contains("button", textoDoBotao).should("not.be.disabled");
});

Then("o botão {string} deve estar desabilitado", (textoDoBotao) => {
  cy.contains("button", textoDoBotao).should("be.disabled");
});
