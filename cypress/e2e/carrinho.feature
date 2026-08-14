# US-05 - Montagem do pedido
#
# Aqui ficam as regras de negócio do carrinho: estoque e cupom.
# São regras que vivem no miolo do sistema, mas que um teste de tela
# verifica do mesmo jeito que o usuário percebe.

@carrinho
Feature: Carrinho de compras
  Como um usuário autenticado
  Eu quero adicionar produtos ao carrinho e aplicar cupons
  Para fechar meu pedido pelo melhor preço

  Background:
    Given que eu estou logado no sistema
    And que eu estou na página de produtos

  # ---- Estado inicial ----

  Scenario: O carrinho começa vazio
    Then o carrinho deve ter 0 unidades
    And eu devo ver o texto "Seu carrinho está vazio."
    And o total do carrinho deve ser "R$ 0,00"
    And o aviso do carrinho não deve aparecer

  # ---- Caminho feliz ----

  Scenario: Adicionar produtos ao carrinho atualiza o total
    When eu adiciono o produto "Monitor 24 polegadas" ao carrinho
    And eu adiciono o produto "Mouse Gamer" ao carrinho
    Then o carrinho deve ter 2 unidades
    And eu devo ver 2 linhas no carrinho
    And o subtotal do carrinho deve ser "R$ 1.399,90"
    And o total do carrinho deve ser "R$ 1.399,90"

  # Duas unidades do mesmo produto viram uma linha só com "2x".
  # Contar unidades e contar linhas são coisas diferentes.
  Scenario: Adicionar o mesmo produto duas vezes agrupa numa linha só
    When eu adiciono o produto "Teclado Mecânico" ao carrinho
    And eu adiciono o produto "Teclado Mecânico" ao carrinho
    Then o carrinho deve ter 2 unidades
    And eu devo ver 1 linha no carrinho
    And a linha "Teclado Mecânico" deve mostrar a quantidade "2x"
    And o subtotal do carrinho deve ser "R$ 700,00"

  Scenario: Remover um produto do carrinho
    When eu adiciono o produto "Monitor 24 polegadas" ao carrinho
    And eu adiciono o produto "Mouse Gamer" ao carrinho
    And eu removo o produto "Mouse Gamer" do carrinho
    Then eu devo ver 1 linha no carrinho
    And o total do carrinho deve ser "R$ 1.200,00"

  Scenario: Remover o último produto esvazia o carrinho
    When eu adiciono o produto "Mouse Gamer" ao carrinho
    And eu removo o produto "Mouse Gamer" do carrinho
    Then o carrinho deve ter 0 unidades
    And eu devo ver o texto "Seu carrinho está vazio."
    And o total do carrinho deve ser "R$ 0,00"

  Scenario: Limpar o carrinho apaga tudo
    When eu adiciono o produto "Monitor 24 polegadas" ao carrinho
    And eu clico no botão "Limpar carrinho"
    Then o carrinho deve ter 0 unidades
    And eu devo ver o texto "Seu carrinho está vazio."
    And o total do carrinho deve ser "R$ 0,00"

  # ---- Regra de estoque ----

  Scenario: É possível adicionar até o limite exato do estoque
    When eu adiciono o produto "Notebook Pro 14" ao carrinho
    And eu adiciono o produto "Notebook Pro 14" ao carrinho
    Then o carrinho deve ter 2 unidades
    And o aviso do carrinho não deve aparecer

  Scenario: Passar do estoque mostra aviso e não conta a unidade
    When eu adiciono o produto "Cadeira Ergonômica" ao carrinho
    And eu adiciono o produto "Cadeira Ergonômica" ao carrinho
    Then eu devo ver o aviso do carrinho "Estoque insuficiente para Cadeira Ergonômica."
    And o carrinho deve ter 1 unidade
    And o total do carrinho deve ser "R$ 1.800,00"

  Scenario: O aviso de erro some depois de uma ação bem-sucedida
    When eu adiciono o produto "Cadeira Ergonômica" ao carrinho
    And eu adiciono o produto "Cadeira Ergonômica" ao carrinho
    Then eu devo ver o aviso do carrinho "Estoque insuficiente para Cadeira Ergonômica."
    When eu adiciono o produto "Mouse Gamer" ao carrinho
    Then o aviso do carrinho não deve aparecer
    And o carrinho deve ter 2 unidades

  # ---- Regras de cupom ----

  Scenario: Um cupom válido aplica desconto no total
    When eu adiciono o produto "Monitor 24 polegadas" ao carrinho
    And eu adiciono o produto "Mouse Gamer" ao carrinho
    And eu aplico o cupom "ALUNO10"
    Then eu devo ver o aviso do carrinho "Cupom ALUNO10 aplicado."
    And o desconto do carrinho deve ser "R$ 139,99"
    And o total do carrinho deve ser "R$ 1.259,91"

  Scenario: O cupom funciona escrito em minúsculas
    When eu adiciono o produto "Teclado Mecânico" ao carrinho
    And eu aplico o cupom "aluno10"
    Then eu devo ver o aviso do carrinho "Cupom ALUNO10 aplicado."
    And o desconto do carrinho deve ser "R$ 35,00"

  Scenario: O desconto acompanha as mudanças do carrinho
    When eu adiciono o produto "Monitor 24 polegadas" ao carrinho
    And eu aplico o cupom "ALUNO10"
    Then o desconto do carrinho deve ser "R$ 120,00"
    When eu adiciono o produto "Teclado Mecânico" ao carrinho
    Then o subtotal do carrinho deve ser "R$ 1.550,00"
    And o desconto do carrinho deve ser "R$ 155,00"

  Scenario Outline: Cupons recusados avisam o motivo
    When eu adiciono o produto "Teclado Mecânico" ao carrinho
    And eu aplico o cupom "<cupom>"
    Then eu devo ver o aviso do carrinho "<mensagem>"
    And o desconto do carrinho deve ser "R$ 0,00"

    Examples:
      | cupom     | mensagem        |
      | QUALQUER  | Cupom inválido. |
      | ALUNO     | Cupom inválido. |
      | PROMO2020 | Cupom expirado. |

  Scenario: Não é possível aplicar dois cupons no mesmo carrinho
    When eu adiciono o produto "Teclado Mecânico" ao carrinho
    And eu aplico o cupom "ALUNO10"
    And eu aplico o cupom "ALUNO10"
    Then eu devo ver o aviso do carrinho "Já existe um cupom aplicado."
    And o desconto do carrinho deve ser "R$ 35,00"

  Scenario: Não é possível aplicar cupom com o carrinho vazio
    When eu aplico o cupom "ALUNO10"
    Then eu devo ver o aviso do carrinho "Adicione produtos antes de aplicar um cupom."
    And o carrinho deve ter 0 unidades

  Scenario: Limpar o carrinho também remove o cupom
    When eu adiciono o produto "Teclado Mecânico" ao carrinho
    And eu aplico o cupom "ALUNO10"
    And eu clico no botão "Limpar carrinho"
    And eu adiciono o produto "Teclado Mecânico" ao carrinho
    And eu aplico o cupom "ALUNO10"
    Then eu devo ver o aviso do carrinho "Cupom ALUNO10 aplicado."
    And o desconto do carrinho deve ser "R$ 35,00"
