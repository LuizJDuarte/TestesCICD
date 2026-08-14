// Passos da US-05 (carrinho.feature).

import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ---------- WHEN ----------

When("eu adiciono o produto {string} ao carrinho", (nome) => {
  // Clica no botão "Adicionar" que está dentro do cartão daquele produto.
  cy.get('[data-produto="' + nome + '"]').find(".btn-adicionar").click();
});

When("eu removo o produto {string} do carrinho", (nome) => {
  cy.get('[data-item="' + nome + '"]').find(".btn-remover").click();
});

When("eu aplico o cupom {string}", (codigo) => {
  cy.get("#campo-cupom").clear().type(codigo);
  cy.get("#btn-aplicar-cupom").click();
});

// ---------- THEN ----------

// Unidades e linhas são coisas diferentes: dois teclados iguais são
// 2 unidades, mas ocupam 1 linha só no carrinho.
Then("o carrinho deve ter {int} unidade(s)", (quantidade) => {
  cy.get("#contador-carrinho").should("have.text", String(quantidade));
});

Then("eu devo ver {int} linha(s) no carrinho", (quantidade) => {
  cy.get("#itens-carrinho .item-carrinho").should("have.length", quantidade);
});

Then("a linha {string} deve mostrar a quantidade {string}", (nome, quantidade) => {
  cy.get('[data-item="' + nome + '"]')
    .find(".item-quantidade")
    .should("have.text", quantidade);
});

Then("o subtotal do carrinho deve ser {string}", (valor) => {
  cy.get("#subtotal-carrinho").should("have.text", valor);
});

Then("o desconto do carrinho deve ser {string}", (valor) => {
  cy.get("#desconto-carrinho").should("have.text", valor);
});

Then("o total do carrinho deve ser {string}", (valor) => {
  cy.get("#total-carrinho").should("have.text", valor);
});

Then("eu devo ver o aviso do carrinho {string}", (mensagem) => {
  cy.get("#mensagem-carrinho")
    .should("be.visible")
    .and("have.text", mensagem);
});

Then("o aviso do carrinho não deve aparecer", () => {
  cy.get("#mensagem-carrinho").should("not.be.visible");
});
