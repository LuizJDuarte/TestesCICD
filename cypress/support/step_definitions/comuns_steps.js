// Passos que servem para qualquer tela do sistema.
// Toda frase que aparece em mais de um .feature mora aqui.

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ---------- GIVEN: preparar a situação inicial ----------

Given("que eu estou logado no sistema", () => {
  // Comando criado em cypress/support/comandos.js
  cy.fazerLogin();
});

Given("que eu encerrei minha sessão", () => {
  cy.window().then((janela) => janela.sessionStorage.clear());
});

// ---------- WHEN: as ações do usuário ----------

When("eu acesso diretamente a página {string}", (pagina) => {
  cy.visit("/" + pagina);
});

// cy.contains("a", texto) acha o link pelo texto que aparece na tela,
// que é como uma pessoa encontraria o link.
When("eu clico no link {string}", (textoDoLink) => {
  cy.contains("a", textoDoLink).click();
});

When("eu clico no botão {string}", (textoDoBotao) => {
  cy.contains("button", textoDoBotao).click();
});

// ---------- THEN: as verificações ----------

Then("eu devo ser redirecionado para {string}", (pagina) => {
  cy.url().should("include", pagina);
});

Then("eu devo ver o título {string}", (titulo) => {
  cy.get("h1").should("be.visible").and("have.text", titulo);
});

Then("eu devo ver o texto {string}", (texto) => {
  cy.contains(texto).should("be.visible");
});

// ---------- Verificações de link ----------

Then("o link {string} deve apontar para {string}", (textoDoLink, destino) => {
  cy.contains("a", textoDoLink).should("have.attr", "href", destino);
});

// Confere só um pedaço do endereço. Serve para links externos longos,
// que mudam de vez em quando.
Then("o link {string} deve conter {string} no endereço", (textoDoLink, pedaco) => {
  cy.contains("a", textoDoLink)
    .should("have.attr", "href")
    .and("include", pedaco);
});

Then("o link {string} deve abrir em uma nova aba", (textoDoLink) => {
  cy.contains("a", textoDoLink).should("have.attr", "target", "_blank");
});

// ---------- Verificações de botão ----------

Then("o botão {string} deve estar habilitado", (textoDoBotao) => {
  cy.contains("button", textoDoBotao).should("not.be.disabled");
});

Then("o botão {string} deve estar desabilitado", (textoDoBotao) => {
  cy.contains("button", textoDoBotao).should("be.disabled");
});
