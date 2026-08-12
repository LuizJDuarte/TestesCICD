// ============================================================
//  Jenkinsfile  -  a "receita" da nossa esteira de CI/CD.
//
//  Este arquivo fica DENTRO do repositório, junto com o código.
//  Ou seja: a configuração da automação é versionada no Git,
//  igual ao resto do projeto. Isso se chama "Pipeline as Code".
//
//  O Jenkins lê este arquivo de cima para baixo e executa os
//  "stages" (etapas) em ordem. Se uma etapa falhar, ele para
//  e marca o build como VERMELHO.
// ============================================================

pipeline {

    // "agent any" = pode rodar em qualquer máquina disponível.
    // No nosso caso só existe uma: o próprio container do Jenkins.
    agent any

    stages {

        // ----------------------------------------------------
        //  ETAPA 1 - PREPARAÇÃO
        //  Baixa tudo que o projeto precisa para rodar.
        // ----------------------------------------------------
        stage('1. Preparacao') {
            steps {
                echo '>> Verificando o ambiente e instalando dependencias...'
                sh 'node --version'
                sh 'npm --version'
                sh 'npm install'
            }
        }

        // ----------------------------------------------------
        //  ETAPA 2 - TESTES
        //  Sobe o site e roda o Cypress SEM abrir janela (headless).
        //  O comando "npm test" faz as duas coisas de uma vez:
        //     1) liga o http-server na porta 8080
        //     2) espera o site responder
        //     3) roda "cypress run"
        //     4) desliga o servidor no final
        // ----------------------------------------------------
        stage('2. Testes') {
            steps {
                echo '>> Rodando os testes Cucumber + Cypress em modo headless...'
                sh 'npm test'
            }
        }

        // ----------------------------------------------------
        //  ETAPA 3 - RESULTADOS
        // ----------------------------------------------------
        stage('3. Resultados') {
            steps {
                echo '========================================='
                echo '  Pipeline finalizada com sucesso!'
                echo '  Os testes rodaram sozinhos, sem ninguem'
                echo '  precisar clicar em nada.'
                echo '========================================='
            }
        }
    }

    // ----------------------------------------------------
    //  POST = o que fazer DEPOIS que a pipeline termina,
    //  não importa se deu certo ou errado.
    // ----------------------------------------------------
    post {
        always {
            // Guarda os vídeos e prints gerados pelo Cypress.
            // Eles ficam disponíveis para download na tela do build.
            // (É assim que você mostra em aula POR QUE um teste falhou.)
            archiveArtifacts artifacts: 'cypress/videos/**, cypress/screenshots/**',
                             allowEmptyArchive: true
        }
        success {
            echo 'BUILD VERDE: todos os cenarios passaram.'
        }
        failure {
            echo 'BUILD VERMELHO: algum cenario falhou. Veja o log acima e o video anexado.'
        }
    }
}
