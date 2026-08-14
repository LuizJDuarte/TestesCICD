# US-01 - Acesso de usuário cadastrado
#
# O bloco "Como / Eu quero / Para" é a história de usuário. Ele responde
# quem usa, o que quer fazer e por quê, antes de existir qualquer teste.

@login
Feature: Login no sistema
  Como um usuário cadastrado da MiniLoja
  Eu quero entrar com meu e-mail e minha senha
  Para acessar a área restrita da aplicação

  # O Background roda antes de cada cenário deste arquivo.
  Background:
    Given que eu estou na página de login

  # ---- Componentes da tela ----

  Scenario: A tela de login exibe todos os seus componentes
    Then eu devo ver o título "Acessar o Sistema"
    And o campo de e-mail deve estar visível e vazio
    And o campo de senha deve estar visível e vazio
    And a mensagem de erro não deve aparecer
    And o link "Esqueci minha senha" deve apontar para "recuperar-senha.html"
    And o link "Criar conta" deve apontar para "cadastro.html"

  # ---- Estado do botão Entrar ----
  # O botão só libera com os dois campos preenchidos. Testar o estado do
  # botão evita que o usuário chegue a enviar um formulário incompleto.

  Scenario: O botão Entrar começa desabilitado
    Then o botão "Entrar" deve estar desabilitado

  Scenario: Só o e-mail preenchido não libera o botão
    When eu preencho o e-mail com "admin@admin.com"
    Then o botão "Entrar" deve estar desabilitado

  Scenario: Só a senha preenchida não libera o botão
    When eu preencho a senha com "123456"
    Then o botão "Entrar" deve estar desabilitado

  Scenario: Com os dois campos preenchidos o botão libera
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "123456"
    Then o botão "Entrar" deve estar habilitado

  Scenario: Apagar um campo desabilita o botão de novo
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "123456"
    And eu apago o campo de senha
    Then o botão "Entrar" deve estar desabilitado

  # ---- Caminho feliz ----

  Scenario: Login com sucesso
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "123456"
    And eu clico no botão "Entrar"
    Then eu devo ser redirecionado para "dashboard.html"
    And eu devo ver o texto "Bem-vindo ao Sistema!"
    And o e-mail "admin@admin.com" deve aparecer no cabeçalho

  Scenario: É possível entrar apertando Enter no teclado
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "123456"
    And eu aperto Enter
    Then eu devo ser redirecionado para "dashboard.html"

  # ---- Credenciais recusadas ----
  # Uma linha da tabela para cada motivo de recusa. Os últimos casos
  # separam "errou o e-mail" de "errou a senha": a mensagem que aparece
  # é a mesma, mas o caminho dentro do sistema é outro.

  Scenario Outline: Credenciais inválidas mostram a mensagem correta
    When eu preencho o e-mail com "<email>"
    And eu preencho a senha com "<senha>"
    And eu clico no botão "Entrar"
    Then eu devo continuar na página de login
    And eu devo ver a mensagem de erro "<mensagem>"

    Examples:
      | email             | senha        | mensagem                    |
      | admin             | 123456       | E-mail em formato inválido. |
      | admin@empresa     | 123456       | E-mail em formato inválido. |
      | admin.admin.com   | 123456       | E-mail em formato inválido. |
      | outro@empresa.com | 123456       | E-mail ou senha inválidos.  |
      | admin@admin.com   | senha-errada | E-mail ou senha inválidos.  |
      | admin@admin.com   | 12345        | E-mail ou senha inválidos.  |

  # ---- Casos-limite de preenchimento ----

  # O campo de e-mail é type="email" e o próprio navegador descarta os
  # espaços em volta. Um e-mail só de espaços chega vazio no JavaScript.
  Scenario: Só espaços no e-mail não liberam o botão
    When eu preencho o e-mail com "   "
    And eu preencho a senha com "123456"
    Then o botão "Entrar" deve estar desabilitado

  # Já o campo de senha guarda os espaços. Aí o botão libera, o usuário
  # clica, e é o sistema que precisa recusar.
  Scenario: Uma senha só com espaços é recusada
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "   "
    And eu clico no botão "Entrar"
    Then eu devo ver a mensagem de erro "Preencha o e-mail e a senha."

  Scenario: Espaços antes e depois do e-mail são ignorados
    When eu preencho o e-mail com "  admin@admin.com  "
    And eu preencho a senha com "123456"
    And eu clico no botão "Entrar"
    Then eu devo ser redirecionado para "dashboard.html"

  Scenario: O e-mail não diferencia maiúsculas de minúsculas
    When eu preencho o e-mail com "ADMIN@ADMIN.COM"
    And eu preencho a senha com "123456"
    And eu clico no botão "Entrar"
    Then eu devo ser redirecionado para "dashboard.html"
    And o e-mail "admin@admin.com" deve aparecer no cabeçalho

  # A senha é comparada exatamente como foi digitada, ao contrário do
  # e-mail. Um espaço a mais já é outra senha.
  Scenario: A senha não aceita espaço a mais
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com " 123456"
    And eu clico no botão "Entrar"
    Then eu devo ver a mensagem de erro "E-mail ou senha inválidos."

  # ---- Recuperação depois do erro ----

  Scenario: Corrigir a senha depois de errar permite entrar
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "senha-errada"
    And eu clico no botão "Entrar"
    Then eu devo ver a mensagem de erro "E-mail ou senha inválidos."
    When eu preencho a senha com "123456"
    And eu clico no botão "Entrar"
    Then eu devo ser redirecionado para "dashboard.html"

  # ---- Bloqueio da conta ----

  Scenario: A conta é bloqueada após 3 tentativas erradas
    When eu erro a senha 3 vezes
    Then eu devo ver a mensagem de erro "Conta bloqueada após 3 tentativas."
    And o botão "Entrar" deve estar desabilitado

  Scenario: A conta bloqueada não libera nem com a senha certa
    When eu erro a senha 3 vezes
    And eu preencho a senha com "123456"
    Then o botão "Entrar" deve estar desabilitado

  # ---- Navegação a partir do login ----

  Scenario: Ir para a recuperação de senha e voltar
    When eu clico no link "Esqueci minha senha"
    Then eu devo ser redirecionado para "recuperar-senha.html"
    And eu devo ver o título "Recuperar senha"
    When eu clico no link "Voltar para o login"
    Then eu devo ser redirecionado para "index.html"
    And eu devo ver o título "Acessar o Sistema"

  Scenario: Ir para a tela de cadastro
    When eu clico no link "Criar conta"
    Then eu devo ser redirecionado para "cadastro.html"
    And eu devo ver o título "Criar conta"
