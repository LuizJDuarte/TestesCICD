// Modo apresentação: deixa o Cypress lento o bastante para a turma
// acompanhar na tela. Ligado por --env pausa=400 (npm run aula e
// npm run cypress:open). Sem o parâmetro, pausa = 0 e nada disso roda,
// que é o que queremos no Jenkins.

import { AfterStep } from "@badeball/cypress-cucumber-preprocessor";

const pausa = Number(Cypress.env("pausa")) || 0;

if (pausa > 0) {
  // Espera um pouco depois de cada passo do Gherkin, para dar tempo de ver
  // na tela o que aquela linha fez.
  AfterStep({ name: "pausa da apresentação" }, () => {
    cy.wait(pausa, { log: false });
  });

  // O type ganha um atraso entre as letras, para parecer alguém digitando.
  // Aqui só mudamos as opções: chamar outro comando cy dentro de um comando
  // reescrito quebra o Cypress.
  Cypress.Commands.overwrite("type", (typeOriginal, elemento, texto, opcoes) =>
    typeOriginal(elemento, texto, { delay: 50, ...opcoes })
  );
}
