const { defineConfig } = require("cypress");

// Por padrão o Cypress só entende arquivos .cy.js. Quem ensina ele a ler
// os .feature do Cucumber é o pré-processador abaixo.
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");

async function setupNodeEvents(on, config) {
  await preprocessor.addCucumberPreprocessorPlugin(on, config);

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
    // Endereço do http-server. Permite escrever cy.visit("/index.html")
    // em vez de repetir o localhost em todo teste.
    baseUrl: "http://localhost:8080",

    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.js",

    video: true,

    setupNodeEvents,
  },
});
