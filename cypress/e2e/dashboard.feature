# US-03 - Painel do usuário autenticado

@dashboard
Feature: Painel principal
  Como um usuário autenticado
  Eu quero ver um resumo da loja e navegar pelo sistema
  Para acompanhar os números e chegar nas outras telas

  # cy.fazerLogin() é um comando criado em cypress/support/comandos.js.
  # Sem ele, estas linhas de login apareceriam repetidas em todos os
  # cenários deste arquivo.
  Background:
    Given que eu estou logado no sistema

  # ---- Componentes da tela ----

  Scenario: O painel exibe os três cartões de resumo
    Then eu devo ver o título "Bem-vindo ao Sistema!"
    And eu devo ver 3 cartões de resumo
    And o cartão "Produtos" deve mostrar o valor "6"
    And o cartão "Pedidos" deve mostrar o valor "12"
    And o cartão "Usuários" deve mostrar o valor "3"

  Scenario: Os links do sistema apontam para os lugares certos
    Then o link "Início" deve apontar para "dashboard.html"
    And o link "Produtos" deve apontar para "produtos.html"
    And o link "Documentação do Cypress" deve conter "docs.cypress.io" no endereço
    And o link "Documentação do Cypress" deve abrir em uma nova aba

  # ---- Navegação ----

  Scenario: Navegar do painel para o catálogo de produtos
    When eu clico no link "Produtos"
    Then eu devo ser redirecionado para "produtos.html"
    And eu devo ver o título "Catálogo de Produtos"

  Scenario: Sair do sistema
    When eu clico no botão "Sair"
    Then eu devo ser redirecionado para "index.html"
    And eu devo ver o título "Acessar o Sistema"

  # ---- Controle de acesso ----
  # Esconder o link não basta: as páginas internas precisam recusar quem
  # digita o endereço direto na barra do navegador.

  Scenario: O painel bloqueia quem não fez login
    Given que eu encerrei minha sessão
    When eu acesso diretamente a página "dashboard.html"
    Then eu devo ser redirecionado para "index.html"
    And eu devo ver o título "Acessar o Sistema"

  Scenario: O catálogo também bloqueia quem não fez login
    Given que eu encerrei minha sessão
    When eu acesso diretamente a página "produtos.html"
    Then eu devo ser redirecionado para "index.html"
    And eu devo ver o título "Acessar o Sistema"

  Scenario: Depois de sair, o endereço direto não funciona mais
    When eu clico no botão "Sair"
    And eu acesso diretamente a página "dashboard.html"
    Then eu devo ser redirecionado para "index.html"
