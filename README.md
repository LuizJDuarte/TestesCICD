# MiniLoja — Projeto de Testes Automatizados

Material prático da aula de **Testes de Software** — Engenharia de Software I.

Este projeto é um sistema web pequeno e propositalmente simples, acompanhado de uma
suíte completa de testes automatizados de ponta a ponta (E2E) escritos com
**Cucumber (Gherkin)** e **Cypress**, e executados automaticamente por uma esteira de
**Integração Contínua no Jenkins**.

São **78 casos de teste** organizados em **5 histórias de usuário**, cobrindo
caminho feliz, fluxos de erro, casos-limite e fluxos alternativos.

> Você não precisa saber nada de teste automatizado para começar. Siga o tutorial na
> ordem; cada parte só usa o que já foi explicado antes.

**Já tem o Node.js e o Git instalados?** Quatro comandos e você vê os testes rodando:

```bash
git clone https://github.com/LuizJDuarte/TestesCICD.git
cd TestesCICD
npm install
npm run aula
```

Se algum deles der erro, comece pela Parte 2.

---

## Índice

1. [O que você vai aprender](#1-o-que-você-vai-aprender)
2. [Preparando a sua máquina](#2-preparando-a-sua-máquina)
3. [Instalando o projeto](#3-instalando-o-projeto)
4. [Rodando o sistema](#4-rodando-o-sistema)
5. [O mapa do projeto](#5-o-mapa-do-projeto)
6. [Como um teste funciona: as três camadas](#6-como-um-teste-funciona-as-três-camadas)
   - [6.6 Os cinco tipos de cenário](#66-os-cinco-tipos-de-cenário)
7. [Rodando os testes](#7-rodando-os-testes)
8. [Onde achar cada coisa](#8-onde-achar-cada-coisa)
9. [Escrevendo o seu primeiro cenário](#9-escrevendo-o-seu-primeiro-cenário)
10. [Quebrando um teste de propósito](#10-quebrando-um-teste-de-propósito)
11. [Integração contínua com Jenkins](#11-integração-contínua-com-jenkins)
12. [Boas práticas para escrever cenários](#12-boas-práticas-para-escrever-cenários)
13. [Exercícios](#13-exercícios)
14. [Problemas comuns](#14-problemas-comuns)
15. [Referências](#15-referências)

---

## 1. O que você vai aprender

| Ferramenta | Papel no projeto |
|---|---|
| **Cucumber / Gherkin** | descrever o comportamento esperado em português, numa linguagem que qualquer pessoa lê |
| **Cypress** | executar esse comportamento num navegador de verdade, clicando e digitando como um usuário |
| **Jenkins** | rodar tudo isso sozinho, num servidor, toda vez que alguém envia código novo |

O fluxo completo é este:

```
História de usuário  ->  arquivo .feature  ->  arquivo de passos  ->  Cypress  ->  navegador
   (o porquê)            (o quê, em          (o como, em            (o robô)      (o sistema)
                          português)          JavaScript)
```

---

## 2. Preparando a sua máquina

Instale os quatro programas abaixo. Todos são gratuitos.

### 2.1 Node.js (obrigatório)

O Node é quem executa o Cypress e o servidor local do site.

1. Acesse <https://nodejs.org>
2. Baixe a versão marcada como **LTS** (é a versão estável)
3. Instale aceitando todas as opções padrão

### 2.2 Git (obrigatório)

Serve para baixar o projeto e, mais para a frente, para alimentar o Jenkins.

- Baixe em <https://git-scm.com/downloads>

### 2.3 Visual Studio Code (recomendado)

Qualquer editor serve, mas o VS Code tem uma extensão que ajuda muito.

1. Baixe em <https://code.visualstudio.com>
2. Abra a pasta do projeto no VS Code (*File › Open Folder*)
3. Aceite a sugestão de instalar a extensão **Cucumber (Gherkin) Full Support**.
   Se a sugestão não aparecer, procure a extensão pelo nome na aba de extensões
   (`Ctrl` + `Shift` + `X`)

Essa extensão colore os arquivos `.feature`, sugere os passos enquanto você digita e
avisa quando uma frase do cenário não tem um passo correspondente no código. Segure
`Ctrl` e clique num passo do `.feature` para abrir o *step definition* dele.

O projeto já vem configurado para ela na pasta `.vscode/`, que diz onde ficam os
cenários e os passos.

### 2.4 Docker Desktop (só para a Parte 11)

Necessário apenas para rodar o Jenkins. Se você só quer estudar os testes, pode pular.

- Baixe em <https://www.docker.com/products/docker-desktop>

### 2.5 Conferindo se deu tudo certo

Abra o terminal (no Windows: **PowerShell**; no Mac/Linux: **Terminal**) e digite:

```bash
node --version
npm --version
git --version
```

Se cada comando responder com um número de versão, está tudo pronto. Se algum disser
*"não é reconhecido como um comando"*, o programa não foi instalado corretamente ou o
terminal precisa ser fechado e aberto de novo.

---

## 3. Instalando o projeto

### 3.1 Baixe o projeto

```bash
git clone https://github.com/LuizJDuarte/TestesCICD.git
cd TestesCICD
```

Se você recebeu o projeto como um arquivo `.zip`, apenas descompacte e entre na pasta.

### 3.2 Instale as dependências

Dentro da pasta do projeto, rode:

```bash
npm install
```

Este comando lê o arquivo `package.json` e baixa tudo que o projeto precisa para dentro
de uma pasta chamada `node_modules`. O que ele instala:

| Pacote | Para que serve |
|---|---|
| `cypress` | o robô que controla o navegador |
| `@badeball/cypress-cucumber-preprocessor` | ensina o Cypress a ler arquivos `.feature` |
| `@bahmutov/cypress-esbuild-preprocessor` e `esbuild` | convertem os `.feature` em JavaScript |
| `http-server` | um servidor web bem simples para abrir o site |
| `start-server-and-test` | liga o site, roda os testes e desliga tudo sozinho |

> ⏱️ **A primeira instalação demora.** O Cypress baixa um navegador próprio (cerca de
> 200 MB). Dependendo da internet, leva de 2 a 10 minutos. Isso acontece **uma vez só**.

> ⚠️ **Se a pasta do projeto estiver dentro do OneDrive, do Google Drive ou do Dropbox**,
> pause a sincronização antes de instalar. A pasta `node_modules` tem milhares de
> arquivos pequenos e a sincronização deixa o computador muito lento. O ideal é mover o
> projeto para um caminho simples, como `C:\dev\TestesCICD`.

### 3.3 Confirme que está tudo funcionando

```bash
npm test
```

Este comando liga o site, roda todos os testes sem abrir janela e desliga o servidor.
No final você deve ver:

```
  78 passing
```

Se apareceu isso, sua máquina está pronta. Se não, pule para a
[Parte 14 — Problemas comuns](#14-problemas-comuns).

---

## 4. Rodando o sistema

Antes de testar, vale usar o sistema como um usuário comum usaria.

```bash
npm start
```

Abra o navegador em **<http://localhost:8080>**.

**Credenciais para entrar:** `admin@admin.com` / `123456`

A MiniLoja tem cinco telas:

| Tela | Arquivo | O que dá para fazer |
|---|---|---|
| **Login** | `index.html` | entrar, errar a senha, ver o botão travar e liberar |
| **Criar conta** | `cadastro.html` | preencher um formulário com 6 regras de validação |
| **Recuperar senha** | `recuperar-senha.html` | pedir um link de redefinição |
| **Painel** | `dashboard.html` | ver os cartões de resumo e navegar |
| **Catálogo** | `produtos.html` | buscar, filtrar, montar o carrinho e aplicar cupom |

**Experimente provocar os erros do sistema.** É neles que os testes mais interessantes
moram:

- reparar que o botão "Entrar" começa travado, e só libera com os dois campos preenchidos;
- apagar um dos campos e ver o botão travar de novo;
- entrar com o e-mail em MAIÚSCULAS ou com espaços em volta (funciona);
- entrar com um espaço antes da senha (não funciona — senha é comparada letra por letra);
- errar a senha três vezes seguidas e ver a conta travar de vez;
- clicar em "Cadastrar" com o formulário totalmente vazio;
- tentar cadastrar o e-mail `admin@admin.com`, que já existe;
- cadastrar um nome com exatamente 3 letras (tem que passar);
- adicionar a "Cadeira Ergonômica" duas vezes (só existe 1 no estoque);
- aplicar o cupom `PROMO2020`, que está expirado, e depois um cupom inventado;
- aplicar um cupom antes de colocar qualquer produto no carrinho.

Para parar o servidor: `Ctrl` + `C` no terminal.

---

## 5. O mapa do projeto

```
TestesCICD/
│
├── sistema/                    O SISTEMA que vamos testar
│   ├── index.html                 login
│   ├── cadastro.html              criar conta
│   ├── recuperar-senha.html       recuperação de senha
│   ├── dashboard.html             painel
│   ├── produtos.html              catálogo + carrinho
│   ├── css/style.css              aparência
│   └── js/
│       ├── login.js               regras do login e do bloqueio por tentativas
│       ├── cadastro.js            regras de validação do formulário
│       ├── recuperar-senha.js     confirmação do envio
│       ├── sessao.js              controle de acesso da área restrita
│       ├── dashboard.js           painel
│       └── produtos.js            catálogo, estoque, carrinho e cupons
│
├── cypress/                    OS TESTES
│   ├── e2e/                       os cenários, em português
│   │   ├── login.feature             US-01
│   │   ├── cadastro.feature          US-02
│   │   ├── dashboard.feature         US-03
│   │   ├── produtos.feature          US-04
│   │   └── carrinho.feature          US-05
│   └── support/
│       ├── e2e.js                    configurações globais
│       ├── comandos.js               comandos criados por nós (cy.fazerLogin)
│       └── step_definitions/         a ponte português -> código
│           ├── comuns_steps.js          passos usados por várias telas
│           ├── login_steps.js           passos da US-01
│           ├── cadastro_steps.js        passos da US-02
│           ├── dashboard_steps.js       passos da US-03
│           ├── produtos_steps.js        passos da US-04
│           ├── carrinho_steps.js        passos da US-05
│           └── apresentacao.js          modo apresentação (pausa entre os passos)
│
├── jenkins/                    A ESTEIRA DE CI/CD
│   ├── Dockerfile                 imagem do Jenkins com Node e Cypress
│   └── init.groovy.d/             cria o usuário admin automaticamente
│
├── .vscode/                    configuração do VS Code (extensão do Cucumber)
├── cypress.config.js           configuração do Cypress
├── docker-compose.yml          sobe o Jenkins com um comando
├── Jenkinsfile                 a pipeline: 3 etapas
├── package.json                dependências e atalhos de comando
└── README.md                   este arquivo
```

### As cinco histórias de usuário

Cada arquivo `.feature` corresponde a uma história de usuário (US, de *user story*).

| US | Arquivo | Cenários | Casos de teste | Assunto |
|---|---|---|---|---|
| US-01 | `login.feature` | 19 | 24 | autenticação, estado do botão, bloqueio, navegação |
| US-02 | `cadastro.feature` | 11 | 18 | validação de formulário e casos-limite |
| US-03 | `dashboard.feature` | 7 | 7 | componentes, links, controle de acesso |
| US-04 | `produtos.feature` | 11 | 11 | listagem, busca, filtro, estoque |
| US-05 | `carrinho.feature` | 16 | 18 | quantidade, estoque e cupons |
| | **Total** | **64** | **78** | |

> **Por que "cenários" e "casos de teste" têm números diferentes?** Porque um
> `Scenario Outline` é um cenário só, escrito uma única vez, que vira um caso de teste
> para cada linha da sua tabela de exemplos. Você vai ver isso na Parte 6.

---

## 6. Como um teste funciona: as três camadas

Esta é a parte mais importante do material. Leia com calma.

### 6.1 Camada 1 — A história de usuário

Todo arquivo `.feature` começa assim:

```gherkin
Feature: Cadastro de novo usuário
  Como um visitante da MiniLoja
  Eu quero criar uma conta informando meus dados
  Para poder entrar no sistema e fazer pedidos
```

Esse formato **Como / Eu quero / Para** é o modelo clássico de história de usuário,
popularizado por Cohn (2004). Ele responde três perguntas antes de existir qualquer
teste:

- **Como um...** → quem é a pessoa que usa isso?
- **Eu quero...** → o que ela quer fazer?
- **Para...** → por que isso vale a pena existir?

A terceira pergunta é a mais esquecida e a mais importante. Uma funcionalidade sem
resposta para o "para quê" costuma ser uma funcionalidade que ninguém pediu.

### 6.2 Camada 2 — O arquivo `.feature` (Gherkin)

Depois da história vêm os cenários. Abra `cypress/e2e/cadastro.feature`:

```gherkin
  Scenario: Cadastro com dados válidos
    When eu preencho o cadastro com dados válidos
    And eu aceito os termos de uso
    And eu clico no botão "Cadastrar"
    Then eu devo ver a mensagem de sucesso "Cadastro realizado com sucesso!"
    And nenhum campo deve estar marcado com erro
```

**Não existe código de programação aqui.** É português. Um cliente, um professor ou um
analista de negócio consegue ler e dizer se está certo ou errado. Essa é a ideia central
do BDD (*Behaviour-Driven Development*), proposto por North (2006).

As palavras-chave são sempre estas:

| Palavra-chave | Para que serve |
|---|---|
| `Feature` | o assunto do arquivo, seguido da história de usuário |
| `Background` | passos que rodam **antes de cada cenário** do arquivo |
| `Scenario` | um caso de teste |
| `Scenario Outline` + `Examples` | um cenário que roda uma vez para cada linha de uma tabela |
| `Given` | a situação inicial (o contexto) |
| `When` | a ação que o usuário faz |
| `Then` | o resultado que se espera |
| `And` | continua o passo anterior, seja ele `Given`, `When` ou `Then` |
| `@etiqueta` | um rótulo, para rodar só um grupo de testes |

> **Por que as palavras-chave estão em inglês se o texto está em português?**
> Porque esse é o padrão da ferramenta e o que você vai encontrar em toda a
> documentação. Além disso, as funções no arquivo de passos se chamam exatamente
> `Given`, `When` e `Then` — sem tradução no meio, a ponte entre os dois arquivos fica
> óbvia. O Cucumber aceita `Dado / Quando / Então` se você colocar `# language: pt` na
> primeira linha, mas aqui usamos a forma mais comum no mercado.

**O `Scenario Outline`** merece atenção. Olhe este trecho do `login.feature`:

```gherkin
  Scenario Outline: Login inválido mostra a mensagem correta
    When eu preencho o e-mail com "<email>"
    And eu preencho a senha com "<senha>"
    And eu clico no botão "Entrar"
    Then eu devo ver a mensagem de erro "<mensagem>"

    Examples:
      | email             | senha        | mensagem                    |
      | admin             | 123456       | E-mail em formato inválido. |
      | admin@empresa     | 123456       | E-mail em formato inválido. |
      | admin.admin.com   | 123456       | E-mail em formato inválido. |
      | outro@empresa.com | 123456       | E-mail ou senha inválidos.  |
      | admin@admin.com   | senha-errada | E-mail ou senha inválidos.  |
      | admin@admin.com   | 12345        | E-mail ou senha inválidos.  |
```

São **seis testes** escritos com cinco linhas. Sempre que a única coisa que muda entre
os casos forem os dados, use uma tabela em vez de copiar e colar o cenário.

### 6.3 Camada 3 — O arquivo de passos (*step definitions*)

Cada frase do `.feature` precisa de um bloco de código que diga o que fazer.
Abra `cypress/support/step_definitions/login_steps.js`:

```javascript
When("eu preencho o e-mail com {string}", (email) => {
  cy.get("#email").clear();
  if (email !== "") {
    cy.get("#email").type(email);
  }
});
```

Traduzindo linha por linha:

- `When("...")` — registra a frase. Ela precisa ser **idêntica** à do `.feature`,
  acentos e pontuação inclusive.
- `{string}` — é um **parâmetro**. Tudo que estiver entre aspas no cenário chega aqui
  dentro da variável `email`. Existe também `{int}` para números.
- `cy.get("#email")` — encontra na página o elemento cujo `id` é `email`.
- `.clear()` — limpa o campo.
- `.type(email)` — digita o texto, letra por letra.

**É só nesta camada que aparecem seletores** (`#email`, `.produto`, `[data-item="..."]`).
O cenário fala de comportamento; o arquivo de passos fala de tela. Manter essa separação
é o que permite mudar todo o layout do sistema sem reescrever um único cenário.

### 6.4 Os comandos de verificação mais usados

O `.should()` é onde o teste realmente passa ou falha. Estes são os que aparecem no
projeto — vale ter esta tabela por perto:

| Comando | O que ele verifica | Onde aparece |
|---|---|---|
| `should("be.visible")` | o elemento está aparecendo na tela | quase todos |
| `should("not.be.visible")` | o elemento existe, mas está escondido | `a mensagem de erro não deve aparecer` |
| `should("not.exist")` | o elemento nem foi criado | `o produto ... não deve estar visível` |
| `should("have.text", "X")` | o texto é **exatamente** X | mensagens de erro, totais |
| `should("contain.text", "X")` | o texto **contém** X em algum lugar | textos longos |
| `should("have.value", "")` | o campo de formulário está vazio | tela de login |
| `should("have.length", 3)` | existem exatamente 3 elementos | cartões, produtos, linhas do carrinho |
| `should("be.disabled")` | o botão está travado | bloqueio por tentativas, produto esgotado |
| `should("have.attr", "href", "x.html")` | o link aponta para esse endereço | menu |
| `.should("have.attr","href").and("include","x")` | o endereço **contém** esse pedaço | link externo |

### 6.5 Comandos criados por nós

Quando uma sequência se repete em vários testes, ela vira um comando novo.
Abra `cypress/support/comandos.js`:

```javascript
Cypress.Commands.add("fazerLogin", (email, senha) => {
  cy.visit("/index.html");
  cy.get("#email").type(email || "admin@admin.com");
  cy.get("#senha").type(senha || "123456");
  cy.get("#btn-entrar").click();
  cy.url().should("include", "dashboard.html");
});
```

Depois de registrado ali, `cy.fazerLogin()` funciona em qualquer arquivo de passos,
igual a `cy.get()` ou `cy.click()`. Sem ele, essas cinco linhas apareceriam repetidas em
34 cenários.

### 6.6 Os cinco tipos de cenário

Testar só o caminho que dá certo é o erro mais comum de quem está começando. Um sistema
quebra nas bordas, não no meio. Por isso os arquivos `.feature` deste projeto são
divididos em seções, e cada seção cobre um tipo diferente de situação.

| Tipo | O que ele verifica | Exemplo no projeto |
|---|---|---|
| **Componentes da tela** | os elementos certos estão lá, no estado certo | `A tela de login exibe todos os seus componentes` |
| **Caminho feliz** | o fluxo principal, com tudo preenchido corretamente | `Login com sucesso` |
| **Fluxo de erro** | cada regra que o sistema precisa recusar | `Credenciais inválidas mostram a mensagem correta` |
| **Caso-limite** | o valor exatamente na fronteira da regra | `Valores exatamente no limite são aceitos` |
| **Fluxo alternativo** | o mesmo objetivo por outro caminho, ou a recuperação depois de um erro | `Corrigir a senha depois de errar permite entrar` |

Repare na proporção: das 24 verificações do login, **apenas 2 são o caminho feliz**. As
outras 22 tratam de coisas que podem dar errado. Essa proporção não é exagero — é o
normal em software de verdade.

Um exemplo de por que vale a pena. Os três cenários abaixo testam a mesma tela, mas
descobrem coisas diferentes:

```gherkin
  Scenario: O botão Entrar começa desabilitado
    Then o botão "Entrar" deve estar desabilitado

  Scenario: Espaços antes e depois do e-mail são ignorados
    When eu preencho o e-mail com "  admin@admin.com  "
    ...
    Then eu devo ser redirecionado para "dashboard.html"

  Scenario: A senha não aceita espaço a mais
    When eu preencho a senha com " 123456"
    ...
    Then eu devo ver a mensagem de erro "E-mail ou senha inválidos."
```

O primeiro impede o usuário de enviar um formulário vazio. O segundo aceita um descuido
de digitação no e-mail. O terceiro garante que a senha **não** seja tratada com a mesma
tolerância — porque aí seria uma falha de segurança. Nenhum dos três aparece se você só
testar "digitei tudo certo e entrei".

**Como descobrir esses cenários.** Para cada campo e cada regra, pergunte:

1. E se estiver vazio?
2. E se tiver só espaços?
3. E se estiver exatamente no limite (3 caracteres, 1 unidade em estoque)?
4. E se passar do limite por 1?
5. E se estiver em maiúsculas?
6. E se o usuário errar e depois corrigir?
7. E se ele fizer a mesma coisa duas vezes seguidas?
8. E se ele pular a tela e ir direto pelo endereço?

Praticamente todos os cenários deste projeto saíram dessas oito perguntas.

---

## 7. Rodando os testes

**Atalho para a aula:** um comando só liga o site e abre o Cypress direto na lista de
testes, já em modo apresentação.

```bash
npm run aula
```

Clique num arquivo `.feature` e assista. Para encerrar, feche a janela do Cypress: o
site desliga junto. Se você já tiver um `npm start` rodando, feche-o antes.

Abaixo está o caminho completo, passo a passo. Ele usa **dois terminais abertos ao mesmo
tempo**, os dois dentro da pasta do projeto.

### 7.1 Terminal 1 — o site

```bash
npm start
```

Deixe rodando. Se você fechar, os testes não têm o que testar.

### 7.2 Terminal 2 — modo visual

```bash
npm run cypress:open
```

Uma janela vai abrir:

1. Escolha **E2E Testing**
2. Escolha o navegador **Chrome** e clique em *Start E2E Testing*
3. Clique em qualquer um dos cinco arquivos `.feature`
4. Assista: o navegador preenche os campos e clica nos botões sozinho

Na coluna da esquerda aparece cada passo executado. **Clique em qualquer passo**: o
Cypress mostra como a tela estava exatamente naquele momento. É a ferramenta mais útil
para entender por que um teste falhou.

> **Velocidade.** Na velocidade normal o Cypress é rápido demais para acompanhar a olho
> nu. Por isso o `npm run cypress:open` já vem em modo apresentação: o Cypress espera
> 400 ms depois de cada passo do cenário e digita letra por letra.
>
> - mais devagar: `npx cypress open --env pausa=800`
> - velocidade normal: `npm run cypress:open:rapido`
>
> Quem faz isso é o arquivo `cypress/support/step_definitions/apresentacao.js`.

### 7.3 Terminal 2 — modo headless

*Headless* significa "sem cabeça", ou seja, sem abrir janela nenhuma. É assim que os
testes rodam num servidor.

```bash
npm run cypress:run
```

### 7.4 Atalhos

| Comando | O que faz |
|---|---|
| `npm run aula` | liga o site e abre o Cypress na lista de testes, em modo apresentação |
| `npm test` | liga o site, roda os 78 casos e desliga tudo (~1 min) |
| `npm run test:lento` | o mesmo, mas devagar — bom para gravar um vídeo |
| `npm run test:login` | só a US-01 |
| `npm run test:cadastro` | só a US-02 |
| `npm run test:dashboard` | só a US-03 |
| `npm run test:produtos` | só a US-04 |
| `npm run test:carrinho` | só a US-05 |

Os atalhos por assunto funcionam graças às **etiquetas** (`@login`, `@cadastro`, ...)
que aparecem na primeira linha de cada `.feature`. Com `filterSpecs` e `omitFiltered`
ligados no `package.json`, o Cypress roda só o arquivo daquela etiqueta, sem listar os
outros cenários como pulados.

### 7.5 O que o Cypress guarda depois de rodar

| Pasta | Conteúdo |
|---|---|
| `cypress/videos/` | um vídeo de cada arquivo executado |
| `cypress/screenshots/` | um print do momento exato de cada falha |

Essas duas pastas são geradas automaticamente e não vão para o Git.

---

## 8. Onde achar cada coisa

| Você quer... | Abra este arquivo |
|---|---|
| ler os cenários de uma tela | `cypress/e2e/<assunto>.feature` |
| ver o código que executa uma frase | `cypress/support/step_definitions/<assunto>_steps.js` |
| ver um passo usado por várias telas | `cypress/support/step_definitions/comuns_steps.js` |
| criar um comando reutilizável | `cypress/support/comandos.js` |
| mudar a velocidade da apresentação | `cypress/support/step_definitions/apresentacao.js` |
| mudar o endereço do site nos testes | `cypress.config.js` (campo `baseUrl`) |
| mudar as regras de validação do cadastro | `sistema/js/cadastro.js` (função `validar`) |
| mudar produtos, preços ou estoque | `sistema/js/produtos.js` (lista `PRODUTOS`) |
| mudar os cupons de desconto | `sistema/js/produtos.js` (objeto `CUPONS`) |
| mudar a senha ou o limite de tentativas | `sistema/js/login.js` (constantes do topo) |
| mudar quem pode acessar a área restrita | `sistema/js/sessao.js` |
| ver ou criar atalhos de comando | `package.json` (bloco `scripts`) |
| mudar as etapas da esteira de CI | `Jenkinsfile` |

---

## 9. Escrevendo o seu primeiro cenário

Vamos adicionar um cenário do zero. A tela de login tem uma caixa "Lembrar de mim" que
ainda não é testada por ninguém.

### Passo 1 — Escreva o cenário em português

Abra `cypress/e2e/login.feature` e adicione no fim do arquivo:

```gherkin
  Scenario: A caixa "Lembrar de mim" começa desmarcada
    Then a caixa "Lembrar de mim" não deve estar marcada
```

### Passo 2 — Rode e veja o teste falhar

```bash
npm run test:login
```

Você vai ver um erro parecido com este:

```
Step implementation missing for: a caixa "Lembrar de mim" não deve estar marcada
```

Isso é esperado e é uma boa notícia: significa que o Cucumber leu a sua frase e está
avisando que ainda não existe código para ela.

### Passo 3 — Escreva o passo

Abra `cypress/support/step_definitions/login_steps.js` e acrescente no fim:

```javascript
Then("a caixa {string} não deve estar marcada", () => {
  cy.get("#lembrar").should("not.be.checked");
});
```

### Passo 4 — Rode de novo

```bash
npm run test:login
```

O cenário agora fica verde.

> Repare na ordem: **primeiro o comportamento em português, depois o código**. Escrever
> nessa ordem obriga você a pensar no que o sistema deve fazer antes de pensar em como
> programar a verificação. Esse é o coração do BDD (North, 2006; Smart & Molak, 2023).

---

## 10. Quebrando um teste de propósito

Um teste que nunca falhou não provou nada. Escolha uma das três formas abaixo — a
terceira é a mais parecida com o que acontece no mundo real.

**a) Quebrar pelo dado.** Em `cypress/e2e/login.feature`, troque a senha do cenário
"Login com sucesso" para `999999`.

**b) Quebrar pela expectativa.** Em `cypress/e2e/produtos.feature`, mude
`eu devo ver 6 produtos na lista` para `10`.

**c) Quebrar o sistema.** Em `sistema/js/produtos.js`, apague uma linha da lista
`PRODUTOS`, ou mude o estoque do "Mouse Gamer" de `3` para `0`.

Rode `npm test` e observe: **você não tocou em nenhum teste, e mesmo assim vários
ficaram vermelhos.** É o que acontece quando alguém altera o sistema sem perceber que
quebrou outra coisa. Descobrir isso em um minuto, e não em produção, é o motivo pelo
qual os testes automatizados existem.

Depois de olhar o erro, **desfaça a alteração**.

---

## 11. Integração contínua com Jenkins

> Esta parte precisa do Docker Desktop instalado e aberto.

### 11.1 O que é integração contínua

De que adianta ter 78 testes se alguém esquecer de rodá-los antes de publicar o sistema?
A Integração Contínua (CI) resolve isso: um servidor busca o código, roda os testes
sozinho e avisa se algo quebrou. O Jenkins é um dos servidores mais usados para isso.

A "receita" da esteira fica no arquivo `Jenkinsfile`, versionado junto com o código.
São três etapas:

```
[ 1. Preparacao ]  ->  [ 2. Testes ]  ->  [ 3. Resultados ]
  npm install          npm test           mensagem final
```

### 11.2 Subindo o Jenkins

```bash
docker compose up -d --build
```

> A primeira vez demora de 5 a 10 minutos: o Docker baixa o Jenkins, instala o Node e as
> bibliotecas que o Cypress precisa. Nas vezes seguintes sobe em segundos.

Acompanhe com `docker compose logs -f jenkins`. Quando aparecer
`Jenkins is fully up and running`, abra **<http://localhost:8081>**.

**Usuário `admin`, senha `admin`.**

> **Por que a porta 8081?** Porque a 8080 é a do site — inclusive dentro do container,
> durante o build. Assim os dois nunca brigam.

### 11.3 Colocando o projeto no Git

O Jenkins não lê pastas soltas: ele busca o código de um repositório.

```bash
git init -b main
git add .
git commit -m "Projeto de testes automatizados"
```

### 11.4 Criando a esteira

No Jenkins:

1. **Nova tarefa** → nome `demo-testes-automatizados` → tipo **Pipeline** → **OK**
2. Role até a seção **Pipeline**, no fim da página
3. *Definition*: **Pipeline script from SCM**
4. *SCM*: **Git**
5. *Repository URL*: a URL do seu repositório no GitHub —
   ou, se você quiser trabalhar sem internet, digite `/projeto`, que é a própria pasta
   do projeto montada dentro do container pelo `docker-compose.yml`
6. *Branch Specifier*: `*/main`
7. *Script Path*: `Jenkinsfile`
8. **Salvar** → **Construir agora**

> Usando `/projeto`, o Jenkins clona apenas o que estiver **commitado**. Se você mudar um
> arquivo, faça `git commit` antes de rodar o build de novo.

### 11.5 Lendo o resultado

Clique no build e depois em **Console Output**:

```
+ npm install
+ npm test
  78 passing
BUILD VERDE: todos os cenarios passaram.
Finished: SUCCESS
```

**Nenhuma janela de navegador abriu**: rodou em modo headless, dentro de um servidor.
Os vídeos e prints do Cypress ficam anexados ao build, disponíveis para download.

Para desligar tudo no fim: `docker compose down`.

---

## 12. Boas práticas para escrever cenários

Estas recomendações vêm da documentação oficial do Cucumber e da literatura sobre BDD e
histórias de usuário. As referências completas estão na Parte 15.

**1. Escreva o cenário do ponto de vista de quem usa, não de quem programa.**
Um cenário nunca deve citar `id`, classe de CSS, tabela de banco ou nome de função.
Compare:

```gherkin
# Ruim (imperativo, fala de tela)
When eu digito "admin@admin.com" no campo "#email"
And eu digito "123456" no campo "#senha"
And eu clico no elemento "#btn-entrar"

# Bom (declarativo, fala de comportamento)
When eu faço login com "admin@admin.com" e "123456"
```

Wynne, Hellesøy e Tooke (2017) chamam isso de escrever cenários **declarativos** em vez
de **imperativos**. Cenários imperativos quebram toda vez que o layout muda, mesmo
quando o comportamento continua correto.

**2. Um cenário, uma regra.** Se você precisa usar "e também" para explicar o que um
cenário testa, provavelmente são dois cenários. Oliveira, Marczak e Moralles (2019)
mostram que cenários que misturam regras são justamente os mais difíceis de manter.

**3. Use `Scenario Outline` quando só os dados mudam.** Repetir o mesmo cenário cinco
vezes trocando uma palavra é o erro mais comum de quem está começando.

**4. Cada cenário precisa funcionar sozinho.** Um cenário nunca pode depender de outro
ter rodado antes. É por isso que o `Background` existe: ele prepara o estado inicial
antes de **cada** cenário, e não uma vez só.

**5. Combata a duplicação de passos.** Binamungu, Embury e Konstantinou (2018)
identificaram que a duplicação em especificações BDD é a principal causa de suítes que
se tornam caras demais para manter. Por isso este projeto tem o `comuns_steps.js` e o
`comandos.js`: antes de escrever um passo novo, procure se já existe um parecido.

**6. Cuide da qualidade da história de usuário, não só do cenário.** Lucassen et al.
(2016) propõem o *Quality User Story framework*, com critérios objetivos. Os três mais
úteis no dia a dia:

- **Bem formada** — tem os três elementos: quem, o quê e o para quê;
- **Atômica** — expressa um único requisito, não vários agrupados;
- **Não ambígua** — evita termos como "rápido", "amigável", "adequado", que ninguém
  consegue transformar em `Then`.

**7. Para cada regra, escreva o cenário que a viola.** Uma regra sem cenário de erro é
uma regra que ninguém garante. Se o sistema diz "a senha precisa ter 6 caracteres",
precisa existir um cenário com 5 caracteres — e, de preferência, um com exatamente 6.
Adzic (2011) chama esses exemplos de fronteira de "key examples": são eles que revelam
divergência de entendimento entre quem pediu e quem programou.

**8. Escreva os exemplos junto com quem entende do negócio.** Adzic (2011) descreve essa
prática como *Specification by Example*: os exemplos concretos discutidos com o cliente
viram, ao mesmo tempo, a especificação e os testes do sistema. Solís e Wang (2011)
identificam essa conversa como uma das características centrais do BDD — a ferramenta é
consequência, não causa.

---

## 13. Exercícios

**Nível 1 — completar o que já existe**

1. Escreva um cenário verificando que a caixa "Lembrar de mim" começa desmarcada
   (o passo a passo está na Parte 9).
2. Escreva os cenários da tela de recuperação de senha: informar um e-mail e conferir a
   mensagem de confirmação; e clicar em "Enviar link" com o campo vazio.
3. Acrescente uma linha ao `Scenario Outline` do carrinho testando o cupom `aluno`
   escrito com espaços em volta.

**Nível 2 — aplicar as oito perguntas da Parte 6.6**

4. Escolha o campo de busca do catálogo e escreva três cenários novos aplicando as
   perguntas: e se for só espaço? e se tiver acento? e se o termo for uma palavra
   inteira que não existe?
5. O carrinho aceita adicionar o mesmo produto até o limite do estoque. Escreva o
   cenário do "limite exato + 1" para o "Mouse Gamer" (estoque 3).
6. O cadastro valida o tamanho do nome. Escreva o cenário de um nome com exatamente
   2 caracteres e outro com exatamente 3, e explique por que os dois são necessários.

**Nível 3 — mexer no sistema e nos testes**

7. Adicione um sétimo produto ao catálogo em `sistema/js/produtos.js`. Descubra quais
   cenários quebram e corrija-os. Por que esses cenários eram frágeis?
8. Crie um cupom `PRIMEIRACOMPRA` com 25% de desconto e escreva os cenários dele,
   incluindo pelo menos um de erro.
9. Faça o sistema exigir senha com pelo menos uma letra maiúscula. Escreva primeiro o
   cenário (ele deve falhar), depois implemente a regra.

**Nível 4 — organização e ferramentas**

10. Transforme "adicionar produto ao carrinho" em um comando customizado
    (`cy.adicionarAoCarrinho("Mouse Gamer")`) em `cypress/support/comandos.js`.
11. Troque os seletores por atributos `data-cy="..."`, seguindo a recomendação oficial
    do Cypress, e explique em um parágrafo por que isso deixa os testes mais estáveis.
12. Configure o Jenkins para rodar a esteira sozinho a cada 5 minutos
    (*Configurar → Gatilhos de construção → Consultar SCM* → `H/5 * * * *`).

---

## 14. Problemas comuns

**`npm` ou `node` não é reconhecido como um comando**
O Node não foi instalado ou o terminal foi aberto antes da instalação. Feche o terminal,
abra de novo e teste com `node --version`.

**`Error: listen EADDRINUSE` ou `Error: listen EACCES` na porta 8080**
Outro programa já está usando a porta 8080: um `npm start` que ficou aberto em outro
terminal, um Jenkins instalado direto no computador ou o contêiner de outro projeto. No
Windows, `netstat -ano | findstr :8080` mostra o número do processo (a última coluna) e
`Get-Process -Id <número>` mostra o nome dele. Feche esse programa, ou troque a porta em
todos os scripts do `package.json` que citam `8080` **e** no `cypress.config.js`
(`baseUrl`). Todos precisam usar a mesma porta.

**O terminal do VS Code mostra `Debugger attached.` a cada comando**
É a depuração automática do VS Code, que está ligada. Não atrapalha os testes. Para
desligar: `Ctrl` + `Shift` + `P` → **Debug: Toggle Auto Attach** → **Disabled**.

**O Cypress abre mas mostra `No specs found`**
Confira o campo `specPattern` no `cypress.config.js`. Ele deve estar
`cypress/e2e/**/*.feature`.

**`Step implementation missing for: ...`**
A frase do `.feature` não bate com nenhuma frase registrada num arquivo de passos. Elas
precisam ser **idênticas** — acento, vírgula e ponto final contam. Copie e cole a frase
da mensagem de erro para dentro do `Then("...")`.

**`Multiple matching step definitions for: ...`**
Duas funções estão registrando a mesma frase, normalmente uma em `comuns_steps.js` e
outra num arquivo específico. Apague uma das duas.

**`cy.type() cannot accept an empty string`**
Algum passo tentou digitar texto vazio. É por isso que os passos de preenchimento têm um
`if (valor !== "")` antes do `.type()`.

**Os testes passam sozinhos mas falham quando rodo todos juntos**
Sinal clássico de cenário dependente de outro. Confira se o `Background` está preparando
tudo que o cenário precisa, em vez de contar com o estado deixado pelo cenário anterior.

**O `npm install` está muito lento ou trava**
Provavelmente a pasta está dentro do OneDrive/Google Drive. Pause a sincronização e
prefira um caminho simples como `C:\dev\TestesCICD`.

**O build do Jenkins falha com erro de biblioteca do Linux**
Falta alguma dependência de sistema do Cypress dentro do container. Rode
`docker exec -u root jenkins-aula npx cypress verify`: a mensagem diz exatamente qual
pacote está faltando.

---

## 15. Referências

### Livros e artigos

**COHN, Mike.** *User Stories Applied: For Agile Software Development*. Boston:
Addison-Wesley, 2004.
→ Origem do formato "Como um... Eu quero... Para...". Leitura base sobre histórias de
usuário.

**NORTH, Dan.** *Introducing BDD*. Better Software Magazine, 2006.
Disponível em: <https://dannorth.net/introducing-bdd/>
→ Artigo em que o BDD e a estrutura *Given-When-Then* são apresentados pela primeira
vez. Curto e essencial.

**WYNNE, Matt; HELLESØY, Aslak; TOOKE, Steve.** *The Cucumber Book: Behaviour-Driven
Development for Testers and Developers*. 2. ed. Raleigh: Pragmatic Bookshelf, 2017.
→ Referência principal sobre Cucumber e sobre como escrever bons cenários Gherkin.

**ADZIC, Gojko.** *Specification by Example: How Successful Teams Deliver the Right
Software*. Shelter Island: Manning, 2011.
→ Mostra como exemplos concretos discutidos com o cliente viram, ao mesmo tempo,
especificação e teste.

**SMART, John Ferguson; MOLAK, Jan.** *BDD in Action: Behavior-Driven Development for
the Whole Software Lifecycle*. 2. ed. Shelter Island: Manning, 2023.
→ Visão prática do BDD do requisito à automação, com exemplos de ferramentas.

**SOLÍS, Carlos; WANG, Xiaofeng.** A Study of the Characteristics of Behaviour Driven
Development. In: *37th EUROMICRO Conference on Software Engineering and Advanced
Applications (SEAA)*. IEEE, 2011. p. 383-387.
DOI: <https://doi.org/10.1109/SEAA.2011.76>
→ Estudo acadêmico que caracteriza o BDD e identifica seus elementos centrais.

**LUCASSEN, Garm; DALPIAZ, Fabiano; VAN DER WERF, Jan Martijn E. M.; BRINKKEMPER,
Sjaak.** Improving agile requirements: the Quality User Story framework and tool.
*Requirements Engineering*, v. 21, n. 3, p. 383-403, 2016.
DOI: <https://doi.org/10.1007/s00766-016-0250-x>
→ Propõe critérios objetivos de qualidade para histórias de usuário (framework QUS).

**OLIVEIRA, Gabriel; MARCZAK, Sabrina; MORALLES, Cassiano.** How to Evaluate BDD
Scenarios' Quality? In: *XXXIII Brazilian Symposium on Software Engineering (SBES)*.
ACM, 2019.
DOI: <https://doi.org/10.1145/3350768.3351301>
→ Trabalho brasileiro sobre critérios de qualidade de cenários BDD. Excelente ponto de
partida para quem quer aprofundar em português.

**BINAMUNGU, Leonard Peter; EMBURY, Suzanne M.; KONSTANTINOU, Nikolaos.** Maintaining
Behaviour Driven Development Specifications: Challenges and Opportunities. In: *IEEE
25th International Conference on Software Analysis, Evolution and Reengineering
(SANER)*. IEEE, 2018. p. 175-184.
→ Estudo sobre por que suítes BDD ficam caras de manter. A duplicação de passos aparece
como principal vilã.

### Documentação oficial

| Ferramenta | Link |
|---|---|
| Gherkin — referência da linguagem | <https://cucumber.io/docs/gherkin/reference> |
| Cucumber — o que é BDD | <https://cucumber.io/docs/bdd/> |
| Cypress — primeiros passos | <https://docs.cypress.io/app/get-started/why-cypress> |
| Cypress — boas práticas | <https://docs.cypress.io/app/core-concepts/best-practices> |
| Cypress — comandos customizados | <https://docs.cypress.io/api/cypress-api/custom-commands> |
| Pré-processador Cucumber usado aqui | <https://github.com/badeball/cypress-cucumber-preprocessor> |
| Jenkins — Pipeline | <https://www.jenkins.io/doc/book/pipeline/> |

---

*Material produzido para a disciplina de Engenharia de Software I.*
*Dúvidas: luiz.mendonca@aluno.uepb.edu.br*
