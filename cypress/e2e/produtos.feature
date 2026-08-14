# US-04 - Consulta ao catálogo

@produtos
Feature: Catálogo de produtos
  Como um usuário autenticado
  Eu quero consultar, buscar e filtrar os produtos da loja
  Para encontrar rapidamente o que eu procuro

  Background:
    Given que eu estou logado no sistema
    And que eu estou na página de produtos

  # ---- Componentes da tela ----

  Scenario: O catálogo lista todos os produtos
    Then eu devo ver 6 produtos na lista
    And o produto "Teclado Mecânico" deve estar visível
    And o produto "Mouse Gamer" deve custar "R$ 199,90"
    And o produto "Mouse Gamer" deve mostrar "3 em estoque"

  Scenario: Um produto sem estoque não pode ser comprado
    Then o produto "Headset Sem Fio" deve mostrar "Esgotado"
    And o botão de adicionar do produto "Headset Sem Fio" deve estar desabilitado

  # ---- Busca ----

  Scenario: Buscar um produto pelo nome
    When eu busco por "mouse"
    Then eu devo ver 1 produto na lista
    And o produto "Mouse Gamer" deve estar visível
    And o produto "Notebook Pro 14" não deve estar visível

  Scenario: A busca não diferencia maiúsculas de minúsculas
    When eu busco por "MOUSE"
    Then eu devo ver 1 produto na lista
    And o produto "Mouse Gamer" deve estar visível

  Scenario: Uma busca parcial pode encontrar mais de um produto
    When eu busco por "mo"
    Then eu devo ver 2 produtos na lista
    And o produto "Monitor 24 polegadas" deve estar visível
    And o produto "Mouse Gamer" deve estar visível

  Scenario: Uma busca sem resultados avisa o usuário
    When eu busco por "geladeira"
    Then eu devo ver 0 produtos na lista
    And eu devo ver o texto "Nenhum produto encontrado."

  Scenario: Limpar a busca traz todos os produtos de volta
    When eu busco por "mouse"
    Then eu devo ver 1 produto na lista
    When eu limpo a busca
    Then eu devo ver 6 produtos na lista

  # ---- Filtro ----

  Scenario: Filtrar produtos por categoria
    When eu filtro pela categoria "Periféricos"
    Then eu devo ver 3 produtos na lista
    And o produto "Cadeira Ergonômica" não deve estar visível

  Scenario: Voltar para todas as categorias mostra tudo de novo
    When eu filtro pela categoria "Móveis"
    Then eu devo ver 1 produto na lista
    When eu filtro pela categoria "Todas"
    Then eu devo ver 6 produtos na lista

  # ---- Busca e filtro juntos ----

  Scenario: A busca e o filtro funcionam juntos
    When eu filtro pela categoria "Periféricos"
    And eu busco por "teclado"
    Then eu devo ver 1 produto na lista
    And o produto "Teclado Mecânico" deve estar visível

  Scenario: A busca e o filtro podem não ter nada em comum
    When eu filtro pela categoria "Móveis"
    And eu busco por "mouse"
    Then eu devo ver 0 produtos na lista
    And eu devo ver o texto "Nenhum produto encontrado."
