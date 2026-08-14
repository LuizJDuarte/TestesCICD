# US-02 - Cadastro de novo usuário
#
# Este arquivo concentra as regras de validação de formulário.
# Nenhum cenário fala em id, classe ou CSS: a história de usuário
# descreve comportamento. Traduzir isso em seletores é trabalho do
# arquivo de passos.

@cadastro
Feature: Cadastro de novo usuário
  Como um visitante da MiniLoja
  Eu quero criar uma conta informando meus dados
  Para poder entrar no sistema e fazer pedidos

  Background:
    Given que eu estou na página de cadastro

  # ---- Componentes da tela ----

  Scenario: A tela de cadastro exibe todos os seus campos
    Then eu devo ver o título "Criar conta"
    And eu devo ver 4 campos de preenchimento
    And o botão "Cadastrar" deve estar habilitado
    And nenhum campo deve estar marcado com erro
    And o link "Já tenho uma conta" deve apontar para "index.html"

  # ---- Caminho feliz ----

  Scenario: Cadastro com dados válidos
    When eu preencho o cadastro com dados válidos
    And eu aceito os termos de uso
    And eu clico no botão "Cadastrar"
    Then eu devo ver a mensagem de sucesso "Cadastro realizado com sucesso!"
    And nenhum campo deve estar marcado com erro

  # ---- Regras de validação ----

  Scenario: Enviar o formulário vazio marca os campos obrigatórios
    When eu clico no botão "Cadastrar"
    Then eu devo ver 4 erros no formulário
    And o campo "nome" deve mostrar o erro "O nome deve ter pelo menos 3 caracteres."
    And o campo "termos" deve mostrar o erro "É preciso aceitar os termos de uso."

  # Cada linha da tabela é uma regra diferente. Assim dá para ver, de uma
  # olhada só, tudo que o sistema recusa.
  Scenario Outline: O cadastro recusa dados inválidos
    When eu preencho o cadastro com nome "<nome>", e-mail "<email>", senha "<senha>" e confirmação "<confirmacao>"
    And eu aceito os termos de uso
    And eu clico no botão "Cadastrar"
    Then o campo "<campo>" deve mostrar o erro "<mensagem>"
    And a mensagem de sucesso não deve aparecer

    Examples:
      | nome      | email             | senha  | confirmacao | campo       | mensagem                                  |
      | Jo        | ana@email.com     | 123456 | 123456      | nome        | O nome deve ter pelo menos 3 caracteres.  |
      | Ana Souza | ana-email         | 123456 | 123456      | e-mail      | E-mail em formato inválido.               |
      | Ana Souza | ana@email         | 123456 | 123456      | e-mail      | E-mail em formato inválido.               |
      | Ana Souza | admin@admin.com   | 123456 | 123456      | e-mail      | Este e-mail já está cadastrado.           |
      | Ana Souza | maria@empresa.com | 123456 | 123456      | e-mail      | Este e-mail já está cadastrado.           |
      | Ana Souza | ana@email.com     | 123    | 123         | senha       | A senha deve ter pelo menos 6 caracteres. |
      | Ana Souza | ana@email.com     | 123456 | 654321      | confirmação | As senhas não conferem.                   |

  Scenario: O cadastro exige aceitar os termos de uso
    When eu preencho o cadastro com dados válidos
    And eu clico no botão "Cadastrar"
    Then o campo "termos" deve mostrar o erro "É preciso aceitar os termos de uso."
    And a mensagem de sucesso não deve aparecer

  # ---- Casos-limite ----
  # O valor exatamente no limite da regra é onde mais aparece bug:
  # "pelo menos 3" acaba virando "mais que 3" sem ninguém notar.

  Scenario Outline: Valores exatamente no limite são aceitos
    When eu preencho o cadastro com nome "<nome>", e-mail "<email>", senha "<senha>" e confirmação "<senha>"
    And eu aceito os termos de uso
    And eu clico no botão "Cadastrar"
    Then eu devo ver a mensagem de sucesso "Cadastro realizado com sucesso!"

    Examples:
      | nome      | email         | senha   |
      | Ana       | ana@email.com | 123456  |
      | Ana Souza | a@b.co        | 1234567 |

  Scenario: Espaços em volta do nome não contam como caracteres
    When eu preencho o cadastro com nome "  Jo  ", e-mail "ana@email.com", senha "123456" e confirmação "123456"
    And eu aceito os termos de uso
    And eu clico no botão "Cadastrar"
    Then o campo "nome" deve mostrar o erro "O nome deve ter pelo menos 3 caracteres."

  Scenario: O e-mail repetido é detectado mesmo escrito em maiúsculas
    When eu preencho o cadastro com nome "Ana Souza", e-mail "ADMIN@ADMIN.COM", senha "123456" e confirmação "123456"
    And eu aceito os termos de uso
    And eu clico no botão "Cadastrar"
    Then o campo "e-mail" deve mostrar o erro "Este e-mail já está cadastrado."

  # ---- Fluxos alternativos ----

  Scenario: Corrigir só uma parte dos erros mantém o restante na tela
    When eu clico no botão "Cadastrar"
    Then eu devo ver 4 erros no formulário
    When eu preencho o cadastro com dados válidos
    And eu clico no botão "Cadastrar"
    Then eu devo ver 1 erro no formulário
    And o campo "termos" deve mostrar o erro "É preciso aceitar os termos de uso."

  Scenario: Corrigir todos os dados depois de um erro permite cadastrar
    When eu clico no botão "Cadastrar"
    Then eu devo ver 4 erros no formulário
    When eu preencho o cadastro com dados válidos
    And eu aceito os termos de uso
    And eu clico no botão "Cadastrar"
    Then nenhum campo deve estar marcado com erro
    And eu devo ver a mensagem de sucesso "Cadastro realizado com sucesso!"

  Scenario: Desmarcar os termos volta a bloquear o cadastro
    When eu preencho o cadastro com dados válidos
    And eu aceito os termos de uso
    And eu desmarco os termos de uso
    And eu clico no botão "Cadastrar"
    Then o campo "termos" deve mostrar o erro "É preciso aceitar os termos de uso."
    And a mensagem de sucesso não deve aparecer
