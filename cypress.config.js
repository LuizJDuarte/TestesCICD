// ============================================================
//  cypress.config.js
//  Arquivo de configuração do Cypress.
//
//  Por padrão o Cypress só entende arquivos ".cy.js".
//  Como vamos escrever nossos testes em Gherkin (arquivos ".feature"),
//  precisamos ensinar o Cypress a ler esse formato.
//  Quem faz essa tradução é o "pré-processador" do Cucumber.
// ============================================================

const { defineConfig } = require("cypress");

// Ferramentas que traduzem .feature -> JavaScript que o Cypress executa
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");

async function setupNodeEvents(on, config) {
  // 1. Liga o plugin do Cucumber
  await preprocessor.addCucumberPreprocessorPlugin(on, config);

  // 2. Manda o esbuild converter os arquivos .feature antes de rodar
  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin.default(config)],
    })
  );

  return config;
}

module.exports = defineConfig({
  e2e: {
    // Endereço onde nosso sistema está rodando (http-server).
    // Com isso, dentro do teste podemos escrever cy.visit("/") em vez
    // de repetir "http://localhost:8080" toda hora.
    baseUrl: "http://localhost:8080",

    // Aqui dizemos: "meus testes são os arquivos .feature"
    specPattern: "cypress/e2e/**/*.feature",

    supportFile: "cypress/support/e2e.js",

    // Grava um vídeo de cada execução (ótimo para mostrar depois em aula)
    video: true,

    setupNodeEvents,
  },
});
