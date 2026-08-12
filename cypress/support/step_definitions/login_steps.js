// ============================================================
//  PASSOS DA TELA DE LOGIN
//
//  Este arquivo é a PONTE entre os dois mundos:
//
//      login.feature   (português, para pessoas)
//             |
//             v
//      login_steps.js  (JavaScript, para o Cypress)
//
//  Cada frase do .feature tem aqui embaixo um bloco de código
//  dizendo o que o robô deve fazer no navegador.
// ============================================================

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ------------------------------------------------------------
//  GIVEN
// ------------------------------------------------------------

Given("que eu estou na página de login", () => {
  // cy.visit() abre uma página. O "/" usa o baseUrl do cypress.config.js
  cy.visit("/index.html");
});

// ------------------------------------------------------------
//  WHEN
// ------------------------------------------------------------

// O {string} é um parâmetro: o que estiver entre aspas no
// .feature chega aqui dentro da variável "email".
When("eu preencho o e-mail com {string}", (email) => {
  cy.get("#email").clear();

  // O Cypress dá erro se mandarmos digitar um texto vazio.
  // Na nossa tabela de exemplos existe uma linha com o campo em branco,
  // então só digitamos quando há algo para digitar.
  if (email !== "") {
    cy.get("#email").type(email);
  }
});

When("eu preencho a senha com {string}", (senha) => {
  cy.get("#senha").clear();
  if (senha !== "") {
    cy.get("#senha").type(senha);
  }
});

When("eu erro a senha {int} vezes", (quantidade) => {
  for (let tentativa = 1; tentativa <= quantidade; tentativa++) {
    cy.get("#email").clear().type("admin@admin.com");
    cy.get("#senha").clear().type("senha-errada");
    cy.get("#btn-entrar").click();
  }
});

// ------------------------------------------------------------
//  THEN — é aqui que o teste passa ou falha
// ------------------------------------------------------------

Then("o campo de e-mail deve estar visível e vazio", () => {
  // Duas verificações no mesmo elemento: existe na tela E está sem conteúdo
  cy.get("#email").should("be.visible").and("have.value", "");
});

Then("o campo de senha deve estar visível e vazio", () => {
  cy.get("#senha").should("be.visible").and("have.value", "");
});

Then("a mensagem de erro não deve aparecer", () => {
  // A div existe no HTML, mas está vazia — e o CSS esconde divs vazias.
  // Por isso verificamos "não está visível", e não "não existe".
  cy.get("#mensagem-erro").should("not.be.visible");
});

Then("eu devo continuar na página de login", () => {
  cy.url().should("include", "index.html");
});

Then("eu devo ver a mensagem de erro {string}", (mensagem) => {
  cy.get("#mensagem-erro")
    .should("be.visible")
    .and("have.text", mensagem);
});
