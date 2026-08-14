// Receita da esteira de CI/CD. Fica no Git junto com o código, então a
// configuração da automação também é versionada.

pipeline {

    // Roda no próprio container do Jenkins.
    agent any

    stages {

        stage('1. Preparacao') {
            steps {
                echo '>> Verificando o ambiente e instalando dependencias...'
                sh 'node --version'
                sh 'npm --version'
                sh 'npm install'
            }
        }

        // "npm test" liga o http-server, espera o site responder, roda o
        // Cypress sem abrir janela e desliga o servidor no fim.
        stage('2. Testes') {
            steps {
                echo '>> Rodando os testes Cucumber + Cypress em modo headless...'
                sh 'npm test'
            }
        }

        stage('3. Resultados') {
            steps {
                echo '========================================='
                echo '  Pipeline finalizada com sucesso!'
                echo '  Os testes rodaram sozinhos.'
                echo '========================================='
            }
        }
    }

    // Roda depois da pipeline, tendo dado certo ou não.
    post {
        always {
            // Guarda os vídeos e prints do Cypress para baixar na tela do build.
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
