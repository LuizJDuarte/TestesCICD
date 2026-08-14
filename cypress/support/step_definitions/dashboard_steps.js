// Passos da US-03 (dashboard.feature).

import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("o e-mail {string} deve aparecer no cabeçalho", (email) => {
  cy.get("#usuario-logado").should("have.text", email);
});

// have.length verifica a quantidade de elementos encontrados.
Then("eu devo ver {int} cartões de resumo", (quantidade) => {
  cy.get(".card-resumo").should("have.length", quantidade);
});

// Acha o cartão pelo data-card e olha só o número dentro dele.
Then("o cartão {string} deve mostrar o valor {string}", (nomeDoCartao, valor) => {
  cy.get('[data-card="' + nomeDoCartao + '"]')
    .find(".card-valor")
    .should("have.text", valor);
});
