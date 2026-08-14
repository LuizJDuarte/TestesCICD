# A imagem oficial do Jenkins só vem com Java. Aqui adicionamos o Node,
# as bibliotecas de Linux que o Cypress precisa e alguns plugins, para não
# depender do assistente de configuração na primeira vez que subir.

FROM jenkins/jenkins:lts

USER root

# O "|| ...t64" existe porque o Debian renomeou algumas dessas bibliotecas
# (libasound2 virou libasound2t64). Assim funciona nas duas versões.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
         ca-certificates curl gnupg xauth xvfb libgbm-dev libnotify-dev \
    && for pacote in libgtk-3-0 libgtk2.0-0 libnss3 libxss1 libxtst6 libasound2; do \
         apt-get install -y --no-install-recommends "$pacote" \
         || apt-get install -y --no-install-recommends "${pacote}t64" \
         || echo ">> AVISO: nao foi possivel instalar $pacote"; \
       done \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && node --version && npm --version

# Cria o usuário admin na primeira inicialização.
COPY init.groovy.d/ /usr/share/jenkins/ref/init.groovy.d/

USER jenkins

# workflow-aggregator -> Pipeline / Jenkinsfile
# git                 -> buscar o código do repositório
# pipeline-stage-view -> a linha de caixinhas verdes dos stages
RUN jenkins-plugin-cli --plugins \
      "workflow-aggregator git pipeline-stage-view"

# Guarda o navegador do Cypress no volume do Jenkins, senão ele baixa
# 200 MB a cada build.
ENV CYPRESS_CACHE_FOLDER=/var/jenkins_home/.cache/Cypress
