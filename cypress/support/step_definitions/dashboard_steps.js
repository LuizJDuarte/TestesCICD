// ============================================================
//  PASSOS DO PAINEL PRINCIPAL (dashboard)
//
//  Aqui aparecem duas técnicas importantes:
//    - CONTAR elementos na tela  (should "have.length")
//    - achar um elemento pelo seu atributo data-* e olhar
//      só um pedaço dele (.find)
// ============================================================

import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("o e-mail {string} deve aparecer no cabeçalho", (email) => {
  cy.get("#usuario-logado").should("have.text", email);
});

Then("eu devo ver {int} cartões de resumo", (quantidade) => {
  // have.length = "quero exatamente essa quantidade de elementos"
  cy.get(".card-resumo").should("have.length", quantidade);
});

Then("o cartão {string} deve mostrar o valor {string}", (nomeDoCartao, valor) => {
  // 1. acha o cartão certo pelo atributo data-card
  // 2. dentro dele, acha o pedaço que guarda o número
  // 3. confere o texto
  cy.get('[data-card="' + nomeDoCartao + '"]')
    .find(".card-valor")
    .should("have.text", valor);
});
