# ============================================================
#  Cenários do catálogo: busca, filtro e carrinho.
#
#  Repare que a lista de produtos é desenhada por JavaScript,
#  mas o teste não sabe disso. Ele só olha para a tela — que é
#  exatamente o que o usuário faz.
# ============================================================

@produtos
Feature: Catálogo de produtos
  Como um usuário autenticado
  Eu quero buscar produtos e colocá-los no carrinho
  Para montar meu pedido

  Background:
    Given que eu estou logado no sistema
    And que eu estou na página de produtos

  Scenario: O catálogo lista todos os produtos
    Then eu devo ver 6 produtos na lista
    And o produto "Teclado Mecânico" deve estar visível
    And o produto "Mouse Gamer" deve custar "R$ 199,90"
    And o carrinho deve mostrar 0 itens

  Scenario: Buscar um produto pelo nome
    When eu busco por "mouse"
    Then eu devo ver 1 produto na lista
    And o produto "Mouse Gamer" deve estar visível
    And o produto "Notebook Pro 14" não deve estar visível

  Scenario: Uma busca sem resultados avisa o usuário
    When eu busco por "geladeira"
    Then eu devo ver 0 produtos na lista
    And eu devo ver o texto "Nenhum produto encontrado."

  Scenario: Filtrar produtos por categoria
    When eu filtro pela categoria "Periféricos"
    Then eu devo ver 3 produtos na lista
    And o produto "Cadeira Ergonômica" não deve estar visível

  Scenario: Adicionar produtos ao carrinho atualiza o total
    When eu adiciono o produto "Monitor 24 polegadas" ao carrinho
    And eu adiciono o produto "Mouse Gamer" ao carrinho
    Then o carrinho deve mostrar 2 itens
    And o total do carrinho deve ser "R$ 1.399,90"
    And o carrinho deve conter o item "Monitor 24 polegadas"
