// Carregado antes de todos os testes: configurações globais e registro
// dos comandos customizados.

import "./comandos";

// Janela maior que o padrão, para o teste ficar legível no projetor.
beforeEach(() => {
  cy.viewport(1280, 800);
});

// O modo apresentação (testes mais lentos para acompanhar na tela) fica
// em step_definitions/apresentacao.js.
