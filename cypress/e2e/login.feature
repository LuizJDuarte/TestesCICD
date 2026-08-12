# ============================================================
#  ARQUIVO DO CUCUMBER (Gherkin)
#
#  As PALAVRAS-CHAVE ficam em inglês (Feature, Scenario, Given,
#  When, Then, And) porque é o padrão da ferramenta e é assim
#  que você vai encontrar em qualquer documentação.
#
#  Já o TEXTO dos cenários é escrito em português, porque é ele
#  que o cliente, o professor ou o analista de negócio vai ler.
#
#     Given  -> a situação inicial (o contexto)
#     When   -> a ação que o usuário faz
#     Then   -> o resultado que eu espero
#     And    -> continua o passo anterior
# ============================================================

@login
Feature: Login no sistema
  Como um usuário da MiniLoja
  Eu quero entrar com meu e-mail e minha senha
  Para acessar a área restrita da aplicação

  # O Background roda ANTES de cada cenário deste arquivo.
  # Evita repetir a mesma primeira linha seis vezes.
  Background:
    Given que eu estou na página de login

  # --- Verificação de COMPONENTES: o que precisa estar na tela ---
  Scenario: A tela de login exibe todos os seus componentes
    Then eu devo ver o título "Acessar o Sistema"
    And o campo de e-mail deve estar visível e vazio
    And o campo de senha deve estar visível e vazio
    And o botão "Entrar" deve estar habilitado
    And a mensagem de erro não deve aparecer
    And o link "Esqueci minha senha" deve apontar para "recuperar-senha.html"

  # --- Fluxo feliz ---
  Scenario: Login com sucesso
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "123456"
    And eu clico no botão "Entrar"
    Then eu devo ser redirecionado para "dashboard.html"
    And eu devo ver o texto "Bem-vindo ao Sistema!"
    And o e-mail "admin@admin.com" deve aparecer no cabeçalho

  # --- Fluxo de erro ---
  Scenario: Login com senha incorreta
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "senha-errada"
    And eu clico no botão "Entrar"
    Then eu devo continuar na página de login
    And eu devo ver a mensagem de erro "E-mail ou senha inválidos."

  # --- Um cenário, vários dados: a tabela de exemplos ---
  # O Cucumber roda este bloco UMA VEZ PARA CADA LINHA da tabela.
  # São 4 testes escritos com 5 linhas de texto.
  Scenario Outline: Login inválido mostra a mensagem correta
    When eu preencho o e-mail com "<email>"
    And eu preencho a senha com "<senha>"
    And eu clico no botão "Entrar"
    Then eu devo ver a mensagem de erro "<mensagem>"

    Examples:
      | email             | senha       | mensagem                     |
      |                   | 123456      | Preencha o e-mail e a senha. |
      | admin@admin.com   |             | Preencha o e-mail e a senha. |
      | admin             | 123456      | E-mail em formato inválido.  |
      | outro@empresa.com | 123456      | E-mail ou senha inválidos.   |

  # --- Regra de negócio: bloqueio por tentativas ---
  Scenario: A conta é bloqueada após 3 tentativas erradas
    When eu erro a senha 3 vezes
    Then eu devo ver a mensagem de erro "Conta bloqueada após 3 tentativas."
    And o botão "Entrar" deve estar desabilitado

  # --- Navegação por links ---
  Scenario: Ir para a recuperação de senha e voltar
    When eu clico no link "Esqueci minha senha"
    Then eu devo ser redirecionado para "recuperar-senha.html"
    And eu devo ver o texto "Recuperar senha"
    When eu clico no link "Voltar para o login"
    Then eu devo ser redirecionado para "index.html"
    And eu devo ver o texto "Acessar o Sistema"
