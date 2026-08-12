# MiniLoja — Demonstração de Testes Automatizados

Projeto de apoio para a aula de **Testes de Software** (Engenharia de Software I).

Mostra, do início ao fim, o ciclo completo:

```
Alguém escreve o comportamento esperado em português   (CUCUMBER)
                        |
                        v
Um robô executa esse comportamento no navegador        (CYPRESS)
                        |
                        v
Um servidor roda isso sozinho a cada mudança de código (JENKINS)
```

**19 casos de teste** distribuídos em 3 arquivos `.feature`, cobrindo autenticação,
componentes de tela, links, navegação, busca, filtro e carrinho.

---

## Sumário

1. [Pré-requisitos](#1-pré-requisitos)
2. [Estrutura do projeto](#2-estrutura-do-projeto)
3. [O sistema que vamos testar](#3-o-sistema-que-vamos-testar)
4. [Instalação (fazer uma vez)](#4-instalação-fazer-uma-vez)
5. [Rodar o sistema](#5-rodar-o-sistema)
6. [Rodar os testes](#6-rodar-os-testes)
7. [O que cada cenário ensina](#7-o-que-cada-cenário-ensina)
8. [Por que as palavras-chave estão em inglês](#8-por-que-as-palavras-chave-estão-em-inglês)
9. [Quebrar o teste de propósito](#9-quebrar-o-teste-de-propósito)
10. [Jenkins no Docker](#10-jenkins-no-docker)
11. [Roteiro cronometrado da aula (1h15)](#11-roteiro-cronometrado-da-aula-1h15)
12. [Checklist da véspera](#12-checklist-da-véspera)
13. [Problemas comuns e soluções](#13-problemas-comuns-e-soluções)

---

## 1. Pré-requisitos

| Ferramenta | Para quê | Onde baixar |
|---|---|---|
| **Node.js 20 ou 22 (LTS)** | rodar o site e o Cypress | https://nodejs.org |
| **Docker Desktop** | rodar o Jenkins | https://www.docker.com/products/docker-desktop |
| **Git** | versionar o código e alimentar o Jenkins | https://git-scm.com |
| **VS Code** | mostrar o código na aula | https://code.visualstudio.com |

Confira no PowerShell:

```bash
node --version    # v20.x ou v22.x
npm --version
docker --version
git --version
```

> **Extensão recomendada do VS Code:** `Cucumber (Gherkin) Full Support` — colore os
> arquivos `.feature` e fica muito melhor no projetor.

> ⚠️ **Atenção com o OneDrive.** Esta pasta está dentro do OneDrive. O `npm install`
> cria a pasta `node_modules` com milhares de arquivos e o OneDrive vai tentar
> sincronizar tudo, deixando o PC lento. **Pause a sincronização antes de instalar**
> (ícone da nuvem → Pausar sincronização → 2 horas), ou mova o projeto para fora do
> OneDrive (ex.: `C:\dev\TestesCICD`).

---

## 2. Estrutura do projeto

```
TestesCICD/
│
├── sistema/                        <- O SISTEMA que vamos testar (MiniLoja)
│   ├── index.html                     login
│   ├── recuperar-senha.html           recuperação de senha
│   ├── dashboard.html                 painel com cartões de resumo
│   ├── produtos.html                  catálogo com busca, filtro e carrinho
│   ├── css/style.css                  estilo (fontes grandes, fundo claro)
│   └── js/
│       ├── login.js                   valida e-mail/senha e bloqueia após 3 erros
│       ├── recuperar-senha.js         mensagem de confirmação
│       ├── sessao.js                  porteiro da área restrita + botão Sair
│       ├── dashboard.js               painel
│       └── produtos.js                lista, busca, filtro e carrinho
│
├── cypress/                        <- OS TESTES
│   ├── e2e/
│   │   ├── login.feature              9 casos: componentes, erros, bloqueio, links
│   │   ├── dashboard.feature          5 casos: cartões, links, navegação, segurança
│   │   └── produtos.feature           5 casos: busca, filtro, carrinho
│   └── support/
│       ├── e2e.js                     configurações globais dos testes
│       └── step_definitions/          a PONTE português -> comandos do Cypress
│           ├── comuns_steps.js           passos que servem para qualquer tela
│           ├── login_steps.js            passos da tela de login
│           ├── dashboard_steps.js        passos do painel
│           └── produtos_steps.js         passos do catálogo
│
├── jenkins/                        <- A ESTEIRA DE CI/CD
│   ├── Dockerfile                     imagem do Jenkins com Node + Cypress
│   └── init.groovy.d/
│       └── 01-usuario-admin.groovy    cria o login admin/admin automaticamente
│
├── cypress.config.js               configuração do Cypress (liga o Cucumber)
├── docker-compose.yml              sobe o Jenkins com um comando
├── Jenkinsfile                     a pipeline: 3 stages
├── package.json                    dependências e atalhos (npm start, npm test)
└── README.md                       este arquivo
```

---

## 3. O sistema que vamos testar

**MiniLoja** — quatro telas, HTML/CSS/JavaScript puro, sem framework e sem back-end.

**Credenciais:** `admin@admin.com` / `123456`

| Tela | O que tem | O que dá para testar |
|---|---|---|
| **Login** (`index.html`) | e-mail, senha, "Lembrar de mim", link "Esqueci minha senha" | campos vazios, formato de e-mail, senha errada, bloqueio após 3 tentativas, destino do link |
| **Recuperar senha** | e-mail, botão, link de volta | navegação entre páginas |
| **Painel** (`dashboard.html`) | cabeçalho com o e-mail logado, menu, 3 cartões de resumo, link externo | contagem de elementos, valores exatos, `href` completo e parcial, `target="_blank"`, acesso sem login |
| **Produtos** (`produtos.html`) | 6 produtos, busca, filtro por categoria, carrinho com total | quantos itens aparecem, elemento que sumiu, texto calculado (total) |

Regras de negócio implementadas de propósito para render bons cenários:

- Campos vazios → `"Preencha o e-mail e a senha."`
- E-mail sem `@` ou sem domínio → `"E-mail em formato inválido."`
- Credenciais erradas → `"E-mail ou senha inválidos."`
- 3 erros seguidos → `"Conta bloqueada após 3 tentativas."` **e o botão fica desabilitado**
- Acessar `dashboard.html` ou `produtos.html` sem login → volta para o login

---

## 4. Instalação (fazer uma vez)

```bash
npm install
```

| Pacote | Papel |
|---|---|
| `cypress` | o robô que controla o navegador |
| `@badeball/cypress-cucumber-preprocessor` | ensina o Cypress a ler arquivos `.feature` |
| `@bahmutov/cypress-esbuild-preprocessor` + `esbuild` | convertem `.feature` → JavaScript |
| `http-server` | servidor local para abrir o site |
| `start-server-and-test` | liga o site, roda os testes e desliga tudo sozinho |

> A primeira instalação baixa o navegador do Cypress (~200 MB). **Faça em casa,
> nunca na hora da aula.**

Confira que está tudo certo:

```bash
npm test
```

Esperado no final: **`19 passing`**. 🎉

---

## 5. Rodar o sistema

```bash
npm start
```

Abra **http://localhost:8080** e navegue na mão: entre, erre a senha, veja os produtos,
adicione ao carrinho.

> **Fala da aula:** *"Toda vez que um desenvolvedor mudar uma linha de código, alguém
> precisa refazer tudo isso. E os outros 300 testes do sistema. Todo dia."*

Para parar: `Ctrl + C`.

---

## 6. Rodar os testes

Você precisa de **dois terminais**.

### Terminal 1 — o site

```bash
npm start
```

### Terminal 2 — o Cypress

**Modo visual (é este que impressiona a turma):**

```bash
npm run cypress:open
```

1. **E2E Testing** → navegador **Chrome** → *Start E2E Testing*
2. Clique em qualquer um dos três `.feature`
3. Assista o navegador se preencher sozinho 🤖

**Modo headless (é assim que roda no servidor):**

```bash
npm run cypress:run
```

**Atalho — liga o site, testa e desliga tudo:**

```bash
npm test
```

**Rodar só um grupo de testes (usando as tags `@login`, `@dashboard`, `@produtos`):**

```bash
npm run test:login       # só os 9 casos de login
npm run test:produtos    # só os 5 casos do catálogo
```

Saída esperada:

```
  Login no sistema
    ✓ A tela de login exibe todos os seus componentes
    ✓ Login com sucesso
    ✓ Login com senha incorreta
    ✓ Login inválido mostra a mensagem correta (x4)
    ✓ A conta é bloqueada após 3 tentativas erradas
    ✓ Ir para a recuperação de senha e voltar
  ...
  19 passing
```

---

## 7. O que cada cenário ensina

Esta tabela é o coração da aula: cada cenário existe para mostrar **uma técnica
diferente de verificação**. Vale deixar aberta enquanto você explica.

| Cenário | Técnica que ele demonstra | Comando do Cypress |
|---|---|---|
| A tela de login exibe todos os seus componentes | o elemento **está na tela**? está **vazio**? | `should("be.visible")`, `have.value` |
| ” | a mensagem de erro **NÃO** deve aparecer | `should("not.be.visible")` |
| ” | o link aponta para o **endereço exato** | `should("have.attr", "href", "...")` |
| Login com sucesso | mudou de página? | `cy.url().should("include", ...)` |
| ” | o e-mail apareceu no cabeçalho? | `should("have.text", ...)` |
| Login com senha incorreta | texto **exato** da mensagem de erro | `should("have.text", ...)` |
| Login inválido (tabela de exemplos) | **1 cenário → 4 testes** com dados diferentes | `Scenario Outline` + `Examples` |
| Conta bloqueada após 3 tentativas | o botão ficou **desabilitado**? | `should("be.disabled")` |
| Ir para a recuperação e voltar | **navegar clicando em links** | `cy.contains("a", ...).click()` |
| Os três cartões de resumo | **contar** elementos na tela | `should("have.length", 3)` |
| ” | achar um elemento pelo `data-*` e olhar só um pedaço | `cy.get('[data-card="..."]').find(...)` |
| Os links apontam para os lugares certos | conferir **só um pedaço** do endereço | `should("have.attr","href").and("include", ...)` |
| ” | o link abre em nova aba? | `should("have.attr","target","_blank")` |
| A área restrita bloqueia quem não fez login | **segurança**: acessar sem sessão | `sessionStorage.clear()` + `cy.visit` |
| O catálogo lista todos os produtos | contar itens gerados por JavaScript | `should("have.length", 6)` |
| Buscar um produto pelo nome | um elemento **sumiu** da tela | `should("not.exist")` |
| Busca sem resultados | apareceu o aviso certo? | `cy.contains(...)` |
| Filtrar por categoria | interagir com **caixa de seleção** | `cy.get(...).select(...)` |
| Adicionar ao carrinho | um valor **calculado** está certo? | `should("have.text", "R$ 1.399,90")` |

> **Fala da aula:** *"Reparem que testar não é só 'clicar e ver se abriu'. É afirmar
> coisas precisas: quantos elementos existem, qual o texto exato, para onde o link
> aponta, se o botão está travado. Cada afirmação dessas é um bug a menos."*

---

## 8. Por que as palavras-chave estão em inglês

Nos arquivos `.feature` você vai ver:

```gherkin
Feature: Login no sistema

  Scenario: Login com sucesso
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "123456"
    And eu clico no botão "Entrar"
    Then eu devo ser redirecionado para "dashboard.html"
```

**As palavras-chave** (`Feature`, `Scenario`, `Background`, `Given`, `When`, `Then`,
`And`, `Examples`) ficam **em inglês** porque:

- é o padrão da ferramenta e o que aparece em 100% da documentação;
- os nomes das funções no arquivo de passos são exatamente `Given`, `When` e `Then` —
  sem tradução no meio, a ponte fica óbvia para quem está vendo pela primeira vez;
- qualquer exemplo que o aluno pesquisar no Google vai estar assim.

**O texto dos cenários** fica **em português**, porque é ele que o cliente, o professor
ou o analista de negócio vai ler. É aí que mora o valor do BDD.

> O Cucumber até aceita `Dado / Quando / Então` (basta a linha `# language: pt` no topo
> do arquivo). Vale mencionar em aula como curiosidade — mas o padrão do mercado é o
> que está aqui.

**Detalhe importante:** `Given`, `When` e `Then` são **a mesma função** por baixo dos
panos. Elas existem separadas só para o código ficar legível. Um passo escrito com
`Given` casa com uma linha `Then` do `.feature` sem problema nenhum.

---

## 9. Quebrar o teste de propósito

**O momento mais importante da aula.** Antes de rodar, **pergunte para a turma o que
vai acontecer.**

Escolha uma das três (a terceira é a mais impressionante):

**a) Quebrar pelo dado** — em `cypress/e2e/login.feature`:

```gherkin
  Scenario: Login com sucesso
    When eu preencho o e-mail com "admin@admin.com"
    And eu preencho a senha com "999999"          <-- senha errada de propósito
```

**b) Quebrar pela expectativa** — em `cypress/e2e/produtos.feature`:

```gherkin
    Then eu devo ver 10 produtos na lista          <-- só existem 6
```

**c) Quebrar o SISTEMA (o mais realista)** — em `sistema/js/produtos.js`, apague um
produto da lista `PRODUTOS`. O teste do catálogo fica vermelho **sem ninguém ter
tocado no teste**. É exatamente o que acontece quando um dev quebra algo sem perceber.

Em qualquer um dos casos o Cypress vai:

- pintar o cenário de **vermelho**
- dizer **qual passo** falhou, **o que esperava** e **o que encontrou**
- salvar um **print** em `cypress/screenshots/`
- salvar um **vídeo** em `cypress/videos/`

> **Fala da aula:** *"Ele não disse só 'falhou'. Disse em que linha, o que esperava, o
> que achou, e ainda tirou uma foto da tela no momento do erro."*

**Não esqueça de desfazer antes de ir para o Jenkins!**

---

## 10. Jenkins no Docker

### 10.1 Por que Docker?

Instalar o Jenkins direto no Windows dá trabalho (Java, PATH, serviço do Windows).
Com Docker é **um comando** — e você joga tudo fora depois.

Nossa imagem (`jenkins/Dockerfile`) já vem com Jenkins, Node.js 22, as bibliotecas de
Linux que o Cypress precisa, os plugins de Pipeline e Git, e o usuário **admin / admin**
já criado (sem tela de assistente).

### 10.2 Subir o Jenkins

Com o **Docker Desktop aberto**, na pasta do projeto:

```bash
docker compose up -d --build
```

> A **primeira** vez demora de 5 a 10 minutos. **Faça isso em casa!**
> Nas vezes seguintes sobe em ~20 segundos.

Acompanhe: `docker compose logs -f jenkins`

Quando aparecer `Jenkins is fully up and running`, abra **http://localhost:8081**
→ usuário `admin`, senha `admin`.

> **Por que 8081 e não 8080?** Porque a 8080 é onde o *site* roda — inclusive dentro do
> container, durante o build. Assim os dois nunca brigam.

Desligar depois da aula:

```bash
docker compose down       # desliga (mantém os dados)
docker compose down -v    # desliga e apaga tudo
```

### 10.3 Colocar o projeto no Git

O Jenkins não lê pastas soltas — ele busca o código de um **repositório Git**:

```bash
git init -b main
git add .
git commit -m "MiniLoja com testes automatizados"
```

### 10.4 Criar o job — Caminho A (GitHub, recomendado)

```bash
git remote add origin https://github.com/SEU-USUARIO/TestesCICD.git
git push -u origin main
```

No Jenkins (http://localhost:8081):

1. **Nova tarefa** (*New Item*)
2. Nome: `demo-testes-automatizados`
3. Tipo: **Pipeline** → **OK**
4. Role até a seção **Pipeline**, no fim da página
5. *Definition*: **Pipeline script from SCM**
6. *SCM*: **Git**
7. *Repository URL*: a URL do seu repositório
8. *Branch Specifier*: `*/main`
9. *Script Path*: `Jenkinsfile`
10. **Salvar** → **Construir agora** (*Build Now*)

### 10.5 Criar o job — Caminho B (offline, plano B sem internet)

O `docker-compose.yml` já monta a pasta do projeto dentro do container em `/projeto`.
Faça igual ao Caminho A, mas no passo 7 use:

- *Repository URL*: `/projeto`

O Jenkins clona direto do disco, **sem internet**.

> ⚠️ Ele clona só o que estiver **commitado**. Mudou um arquivo? `git commit` antes de
> rodar o build. *(Isso é ótimo para a aula: mostra que o CI trabalha em cima do que
> foi versionado.)*

### 10.6 O que mostrar durante o build

As três caixinhas se acendendo:

```
[ 1. Preparacao ]  ->  [ 2. Testes ]  ->  [ 3. Resultados ]
```

E o **Console Output** ao vivo:

```
+ npm install
+ npm test
  19 passing
BUILD VERDE: todos os cenarios passaram.
Finished: SUCCESS
```

> **Fala da aula:** *"Reparem: nenhuma janela de navegador abriu. Rodou em modo
> headless, dentro de um servidor, sem ninguém olhando. 19 testes em menos de um
> minuto. É exatamente isso que acontece numa empresa a cada código novo."*

**Bônus de impacto:** quebre um teste, faça `git commit`, rode o build de novo. A
pipeline fica **vermelha** e o vídeo do erro aparece anexado no build.

> ⏱️ O **primeiro build** demora alguns minutos (baixa o Cypress dentro do container).
> Rode um build de teste em casa: os seguintes levam ~40 segundos.

---

## 11. Roteiro cronometrado da aula (1h15)

Alinhado com o seu deck de slides (16 slides).

| Tempo | Slides | Bloco | O que fazer |
|---|---|---|---|
| **00:00 – 00:04** | 1–2 | 🎬 Teoria | Abertura. O que é teste de software. Verificação × Validação. |
| **00:04 – 00:10** | 3–4 | 🎬 Teoria | Pirâmide de testes e foco em E2E. O que é BDD. |
| **00:10 – 00:15** | 5–6 | 🎬 Teoria | Por que automatizar. Apresentar o arsenal: Cucumber, Cypress, Jenkins. |
| **00:15 – 00:20** | — | 💻 **Prática** | Abrir a MiniLoja e usar **na mão**: login, erro de senha, produtos, carrinho. *"Imagine repetir isso 300 vezes."* |
| **00:20 – 00:26** | 7 | 🎬 Teoria | Cucumber e Gherkin: `Feature`, `Scenario`, `Given/When/Then`. Por que as palavras-chave são em inglês e o texto em português. |
| **00:26 – 00:35** | 8 | 💻 **Prática** | Abrir `login.feature` no VS Code. Ler os cenários em voz alta. Mostrar o `Scenario Outline` — *"1 cenário, 4 testes"*. |
| **00:35 – 00:41** | 9 | 🎬 Teoria | Cypress: como o robô "enxerga" a tela (`id`, classe, `data-*`). |
| **00:41 – 00:55** | 10 | 💻 **Prática** | Abrir `login_steps.js` (a ponte). Rodar `npm run cypress:open` — **o momento "uau"**. Depois **quebrar o teste** (seção 9) e rodar de novo. |
| **00:55 – 01:01** | 11 | 🎬 Teoria | Jenkins: Integração Contínua, pipeline, modo headless. |
| **01:01 – 01:10** | 12 | 💻 **Prática** | Mostrar o `Jenkinsfile` (3 stages). **Build Now**. Caixinhas verdes + Console Output. |
| **01:10 – 01:15** | 13–16 | 🎬 Fechamento | O ciclo completo. Perguntas. Contato e referências. |

**Perguntas para jogar na turma:**

- *Antes de rodar o teste:* "O que vocês acham que vai acontecer na tela?"
- *No `Scenario Outline`:* "Quantos testes vocês acham que essas 5 linhas geram?"
- *Antes de quebrar o teste:* "Se eu apagar um produto do sistema, qual teste vai
  reclamar? E o teste de login, vai continuar verde?"
- *No Jenkins:* "Por que aqui o navegador não abriu?"
- *No fim:* "Quanto tempo uma empresa economiza com isso por mês?"

---

## 12. Checklist da véspera

- [ ] `npm install` rodou até o fim, sem erro
- [ ] `npm test` mostrou **`19 passing`**
- [ ] `npm run cypress:open` abriu a janela e os testes rodaram visualmente
- [ ] `docker compose up -d --build` terminou e o Jenkins abriu em http://localhost:8081
- [ ] O job `demo-testes-automatizados` foi criado
- [ ] **Um build já rodou até o fim e ficou VERDE** (deixa o cache pronto — o build da aula fica rápido)
- [ ] Você já testou quebrar um teste e sabe como o erro aparece
- [ ] Sincronização do OneDrive pausada
- [ ] Fonte do VS Code aumentada (`Ctrl` + `+`) e tema **claro**
- [ ] Zoom do navegador em 125–150%
- [ ] Notificações do Windows silenciadas (`Win` + `A` → Assistente de Foco)
- [ ] Abas pessoais do navegador fechadas
- [ ] Terminais já abertos na pasta do projeto

**Plano B (internet cai):** tudo roda offline, desde que `npm install` e
`docker compose up --build` já tenham sido feitos em casa. Use o **Caminho B** (10.5).

**Plano C (Docker trava):** rode `npm run cypress:run` e mostre o terminal. É
exatamente o mesmo comando do stage 2 do Jenkins — a mensagem da aula não se perde.

---

## 13. Problemas comuns e soluções

**`Error: listen EADDRINUSE: address already in use :::8080`**
Algo já usa a porta 8080. Feche o outro terminal, ou mude a porta no `package.json`
(script `start`) **e** no `cypress.config.js` (`baseUrl`) — precisa ser a mesma nos dois.

**O Cypress abre mas diz `No specs found`**
Confira o `specPattern` no `cypress.config.js`: `cypress/e2e/**/*.feature`.

**`Step implementation missing for: ...`**
A frase do `.feature` está diferente da frase do arquivo de passos. Elas precisam ser
**idênticas** (acentos e pontuação contam!). Confira também o bloco
`cypress-cucumber-preprocessor.stepDefinitions` no `package.json`.

**`Multiple matching step definitions for: ...`**
Duas funções de passo estão casando com a mesma frase — provavelmente uma em
`comuns_steps.js` e outra em um arquivo específico. Apague uma das duas.

**`cy.type() cannot accept an empty string`**
Um passo tentou digitar texto vazio. É por isso que os passos de e-mail e senha têm um
`if (valor !== "")` antes do `.type()`.

**`docker compose up` falha com erro de porta**
Algo já ocupa a 8081. Troque no `docker-compose.yml` (altere `"8081:8081"` **e**
`JENKINS_OPTS=--httpPort=...` para o mesmo número).

**O build do Jenkins falha no `npm test` com erro de biblioteca do Linux**
Falta alguma dependência de sistema do Cypress. Rode:

```bash
docker exec -u root jenkins-aula apt-get update
docker exec -u root jenkins-aula npx cypress verify
```

A mensagem do `cypress verify` diz exatamente qual pacote falta. Instale com
`docker exec -u root jenkins-aula apt-get install -y NOME-DO-PACOTE` e acrescente o
pacote ao `jenkins/Dockerfile`.

**O Jenkins não acha o `Jenkinsfile`**
No job, *Script Path* precisa ser exatamente `Jenkinsfile` (sem barra na frente) e o
arquivo precisa estar commitado.

**Esqueci de commitar e o build rodou o código antigo (Caminho B)**
Normal e esperado. `git add . && git commit -m "ajuste"` e *Build Now* de novo.

---

## Exercícios para deixar com a turma

1. Criar um cenário que **remove** um item do carrinho (precisa implementar no sistema
   primeiro — ótimo exercício de "escreva o teste antes do código").
2. Usar `Scenario Outline` + `Examples` para testar a busca com vários termos.
3. Adicionar um cenário que confira que o campo "Lembrar de mim" começa desmarcado
   (`should("not.be.checked")`).
4. Trocar os seletores por atributos `data-cy="..."` — a prática recomendada oficial do
   Cypress, para o teste não quebrar quando o CSS mudar.
5. Fazer o Jenkins rodar sozinho a cada 5 minutos
   (*Configurar → Gatilhos de construção → Consultar SCM* → `H/5 * * * *`).
