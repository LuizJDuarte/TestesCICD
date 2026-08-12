# ============================================================
#  Imagem do Jenkins já preparada para a aula.
#
#  A imagem oficial do Jenkins só vem com Java. Nosso projeto precisa de:
#    1) Node.js  -> para rodar "npm install" e o Cypress
#    2) Bibliotecas gráficas do Linux -> o Cypress abre um navegador
#       de verdade por baixo dos panos, mesmo em modo headless
#    3) Alguns plugins do Jenkins já instalados -> assim você NÃO precisa
#       esperar o assistente de configuração baixar tudo na hora da aula
#
#  É por isso que criamos nossa própria imagem em vez de usar a oficial.
# ============================================================

FROM jenkins/jenkins:lts

# ------------------------------------------------------------
#  Parte 1: instalar programas (precisa ser usuário root)
# ------------------------------------------------------------
USER root

# Bibliotecas de sistema exigidas pelo Cypress no Linux.
# O "|| ...t64 || echo" existe porque o Debian renomeou algumas dessas
# bibliotecas (ex.: libasound2 virou libasound2t64). Com o laço abaixo,
# o Dockerfile funciona nas duas versões do Debian sem você precisar mexer.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
         ca-certificates curl gnupg xauth xvfb libgbm-dev libnotify-dev \
    && for pacote in libgtk-3-0 libgtk2.0-0 libnss3 libxss1 libxtst6 libasound2; do \
         apt-get install -y --no-install-recommends "$pacote" \
         || apt-get install -y --no-install-recommends "${pacote}t64" \
         || echo ">> AVISO: nao foi possivel instalar $pacote"; \
       done \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22 (LTS) via NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && node --version && npm --version

# Script que cria o usuário admin automaticamente na primeira inicialização.
# (Sem isso, o Jenkins pede uma senha secreta escondida em um arquivo de log.)
COPY init.groovy.d/ /usr/share/jenkins/ref/init.groovy.d/

# ------------------------------------------------------------
#  Parte 2: voltar para o usuário normal do Jenkins
# ------------------------------------------------------------
USER jenkins

# Plugins do Jenkins já embutidos na imagem:
#   workflow-aggregator -> permite usar Pipeline / Jenkinsfile
#   git                 -> permite buscar o código de um repositório
#   pipeline-stage-view -> desenha aquela linha de caixinhas verdes dos stages
RUN jenkins-plugin-cli --plugins \
      "workflow-aggregator git pipeline-stage-view"

# Guarda o navegador baixado pelo Cypress dentro do volume do Jenkins.
# Assim ele NÃO precisa baixar ~200 MB de novo a cada build.
ENV CYPRESS_CACHE_FOLDER=/var/jenkins_home/.cache/Cypress
