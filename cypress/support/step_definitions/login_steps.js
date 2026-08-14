// Passos da US-01 (login.feature).
// Aqui a frase em português vira comando de navegador. Os seletores
// (#email, #btn-entrar) só aparecem neste lado da ponte.

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ---------- GIVEN ----------

Given("que eu estou na página de login", () => {
  // O "/" usa o baseUrl definido em cypress.config.js
  cy.visit("/index.html");
});

// ---------- WHEN ----------

// O {string} é um parâmetro: o que estiver entre aspas no .feature
// chega aqui dentro da variável.
When("eu preencho o e-mail com {string}", (email) => {
  cy.get("#email").clear();

  // O Cypress dá erro se mandarmos digitar texto vazio.
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

When("eu apago o campo de senha", () => {
  cy.get("#senha").clear();
});

// {enter} é a forma de mandar uma tecla especial em vez de texto.
When("eu aperto Enter", () => {
  cy.get("#senha").type("{enter}");
});

When("eu erro a senha {int} vezes", (quantidade) => {
  for (let tentativa = 1; tentativa <= quantidade; tentativa++) {
    cy.get("#email").clear().type("admin@admin.com");
    cy.get("#senha").clear().type("senha-errada");
    cy.get("#btn-entrar").click();
  }
});

// ---------- THEN ----------

Then("o campo de e-mail deve estar visível e vazio", () => {
  // Duas verificações no mesmo elemento: aparece na tela e está sem conteúdo.
  cy.get("#email").should("be.visible").and("have.value", "");
});

Then("o campo de senha deve estar visível e vazio", () => {
  cy.get("#senha").should("be.visible").and("have.value", "");
});

// A div existe no HTML mas está vazia, e o CSS esconde divs vazias.
// Por isso "não está visível" e não "não existe".
Then("a mensagem de erro não deve aparecer", () => {
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
