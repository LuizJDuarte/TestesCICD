// Carregado antes de todos os testes: configurações globais e registro
// dos comandos customizados.

import "./comandos";

// Janela maior que o padrão, para o teste ficar legível no projetor.
beforeEach(() => {
  cy.viewport(1280, 800);
});

// Modo apresentação: deixa o Cypress lento o bastante para dar tempo de
// acompanhar na tela. Ligado por --env pausa=400 (ver o package.json).
// Sem o parâmetro, pausa = 0 e nada disso roda — que é o que queremos
// no Jenkins.
const pausa = Number(Cypress.env("pausa")) || 0;

if (pausa > 0) {
  // Espera um instante antes de executar o comando original.
  const comAtraso = (comandoOriginal, ...args) =>
    cy.wait(pausa, { log: false }).then(() => comandoOriginal(...args));

  Cypress.Commands.overwrite("visit", comAtraso);
  Cypress.Commands.overwrite("click", comAtraso);
  Cypress.Commands.overwrite("select", comAtraso);
  Cypress.Commands.overwrite("clear", comAtraso);
  Cypress.Commands.overwrite("check", comAtraso);

  // O type ganha um atraso entre cada letra, para parecer alguém digitando.
  Cypress.Commands.overwrite("type", (comandoOriginal, elemento, texto, opcoes) =>
    cy.wait(pausa, { log: false }).then(() =>
      comandoOriginal(elemento, texto, { delay: 50, ...opcoes })
    )
  );
}
