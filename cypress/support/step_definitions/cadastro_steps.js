// Passos da US-02 (cadastro.feature).

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// O .feature fala em "nome", "e-mail", "senha" porque é assim que uma
// pessoa descreve o formulário. A tradução para os seletores da tela é
// feita aqui, e não no cenário.
const ERRO_DO_CAMPO = {
  nome: "#erro-nome",
  "e-mail": "#erro-email",
  senha: "#erro-senha",
  confirmação: "#erro-confirmacao",
  termos: "#erro-termos",
};

// Evita chamar .type() com texto vazio, o que faria o Cypress dar erro.
function preencher(seletor, valor) {
  cy.get(seletor).clear();
  if (valor !== "") {
    cy.get(seletor).type(valor);
  }
}

// ---------- GIVEN ----------

Given("que eu estou na página de cadastro", () => {
  cy.visit("/cadastro.html");
});

// ---------- WHEN ----------

When("eu preencho o cadastro com dados válidos", () => {
  preencher("#nome", "Ana Souza");
  preencher("#email-cadastro", "ana@email.com");
  preencher("#senha-cadastro", "123456");
  preencher("#confirmar-senha", "123456");
});

When(
  "eu preencho o cadastro com nome {string}, e-mail {string}, senha {string} e confirmação {string}",
  (nome, email, senha, confirmacao) => {
    preencher("#nome", nome);
    preencher("#email-cadastro", email);
    preencher("#senha-cadastro", senha);
    preencher("#confirmar-senha", confirmacao);
  }
);

// .check() marca e .uncheck() desmarca caixas de seleção.
When("eu aceito os termos de uso", () => {
  cy.get("#aceitar-termos").check();
});

When("eu desmarco os termos de uso", () => {
  cy.get("#aceitar-termos").uncheck();
});

// ---------- THEN ----------

Then("eu devo ver {int} campos de preenchimento", (quantidade) => {
  cy.get('input[type="text"], input[type="email"], input[type="password"]')
    .should("have.length", quantidade);
});

Then("nenhum campo deve estar marcado com erro", () => {
  cy.get(".erro-campo").should("not.be.visible");
});

// O ":visible" pega só os erros que estão na tela, ignorando os espaços
// vazios dos campos que passaram na validação.
Then("eu devo ver {int} erro(s) no formulário", (quantidade) => {
  cy.get(".erro-campo:visible").should("have.length", quantidade);
});

Then("o campo {string} deve mostrar o erro {string}", (campo, mensagem) => {
  cy.get(ERRO_DO_CAMPO[campo])
    .should("be.visible")
    .and("have.text", mensagem);
});

Then("eu devo ver a mensagem de sucesso {string}", (mensagem) => {
  cy.get("#mensagem-sucesso")
    .should("be.visible")
    .and("have.text", mensagem);
});

Then("a mensagem de sucesso não deve aparecer", () => {
  cy.get("#mensagem-sucesso").should("not.be.visible");
});
