// ============================================================
//  PASSOS DO CATÁLOGO DE PRODUTOS
//
//  Estes são os testes mais "profundos" do projeto: além de
//  clicar, eles conferem QUANTOS elementos existem, se um
//  elemento sumiu da tela e se um valor calculado está certo.
// ============================================================

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ------------------------------------------------------------
//  GIVEN
// ------------------------------------------------------------

Given("que eu estou na página de produtos", () => {
  cy.visit("/produtos.html");
});

// ------------------------------------------------------------
//  WHEN
// ------------------------------------------------------------

When("eu busco por {string}", (termo) => {
  cy.get("#campo-busca").clear().type(termo);
});

When("eu filtro pela categoria {string}", (categoria) => {
  // .select() é o comando para caixas de seleção (<select>)
  cy.get("#filtro-categoria").select(categoria);
});

When("eu adiciono o produto {string} ao carrinho", (nomeDoProduto) => {
  // Acha o cartão do produto pelo atributo data-produto e
  // clica no botão "Adicionar" que está DENTRO dele.
  cy.get('[data-produto="' + nomeDoProduto + '"]')
    .find(".btn-adicionar")
    .click();
});

// ------------------------------------------------------------
//  THEN
// ------------------------------------------------------------

// O "(s)" no final de "produto(s)" é um recurso do Cucumber:
// este mesmo passo atende "1 produto" e "6 produtos".
Then("eu devo ver {int} produto(s) na lista", (quantidade) => {
  cy.get("#lista-produtos .produto").should("have.length", quantidade);
});

Then("o produto {string} deve estar visível", (nomeDoProduto) => {
  cy.get('[data-produto="' + nomeDoProduto + '"]').should("be.visible");
});

Then("o produto {string} não deve estar visível", (nomeDoProduto) => {
  // "not.exist" = o elemento nem chegou a ser criado na tela
  cy.get('[data-produto="' + nomeDoProduto + '"]').should("not.exist");
});

Then("o produto {string} deve custar {string}", (nomeDoProduto, preco) => {
  cy.get('[data-produto="' + nomeDoProduto + '"]')
    .find(".produto-preco")
    .should("have.text", preco);
});

Then("o carrinho deve mostrar {int} itens", (quantidade) => {
  cy.get("#contador-carrinho").should("have.text", String(quantidade));
});

Then("o total do carrinho deve ser {string}", (total) => {
  cy.get("#total-carrinho").should("have.text", total);
});

Then("o carrinho deve conter o item {string}", (nomeDoProduto) => {
  // contain.text = "em algum lugar aqui dentro tem esse texto"
  cy.get("#itens-carrinho").should("contain.text", nomeDoProduto);
});
