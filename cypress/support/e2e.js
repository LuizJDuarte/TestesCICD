// ============================================================
//  Arquivo de suporte do Cypress.
//  Ele é carregado ANTES de todos os testes.
//  Serve para colocar configurações globais e comandos próprios.
//  Para esta aula, ele pode ficar praticamente vazio.
// ============================================================

// Exemplo de configuração global: aumenta a janela do navegador
// durante os testes, para ficar bem visível no projetor.
beforeEach(() => {
  cy.viewport(1280, 800);
});
