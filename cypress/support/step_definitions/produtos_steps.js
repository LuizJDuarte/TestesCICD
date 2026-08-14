// Passos da US-04 (produtos.feature).

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Cada cartão de produto tem um atributo data-produto com o nome dele.
// Usar um atributo em vez de "o terceiro cartão da lista" faz o teste
// continuar valendo se a ordem ou o layout mudarem.
function cartaoDoProduto(nome) {
  return cy.get('[data-produto="' + nome + '"]');
}

// ---------- GIVEN ----------

Given("que eu estou na página de produtos", () => {
  cy.visit("/produtos.html");
});

// ---------- WHEN ----------

When("eu busco por {string}", (termo) => {
  cy.get("#campo-busca").clear().type(termo);
});

When("eu limpo a busca", () => {
  cy.get("#campo-busca").clear();
});

// .select() é o comando para caixas de seleção (<select>).
When("eu filtro pela categoria {string}", (categoria) => {
  cy.get("#filtro-categoria").select(categoria);
});

// ---------- THEN ----------

// O "(s)" é um recurso do Cucumber: o mesmo passo atende "1 produto"
// e "6 produtos".
Then("eu devo ver {int} produto(s) na lista", (quantidade) => {
  cy.get("#lista-produtos .produto").should("have.length", quantidade);
});

Then("o produto {string} deve estar visível", (nome) => {
  cartaoDoProduto(nome).should("be.visible");
});

// Depois de filtrar, o cartão nem chega a ser criado na tela.
// Por isso "not.exist" e não "not.be.visible".
Then("o produto {string} não deve estar visível", (nome) => {
  cartaoDoProduto(nome).should("not.exist");
});

Then("o produto {string} deve custar {string}", (nome, preco) => {
  cartaoDoProduto(nome).find(".produto-preco").should("have.text", preco);
});

Then("o produto {string} deve mostrar {string}", (nome, textoDoEstoque) => {
  cartaoDoProduto(nome).find(".produto-estoque").should("have.text", textoDoEstoque);
});

Then("o botão de adicionar do produto {string} deve estar desabilitado", (nome) => {
  cartaoDoProduto(nome).find(".btn-adicionar").should("be.disabled");
});
