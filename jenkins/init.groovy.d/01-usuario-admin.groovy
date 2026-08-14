/*
 * Roda na primeira vez que o Jenkins sobe e cria o usuário admin/admin,
 * para não ter que procurar a senha secreta no log do container.
 * Em produção, obviamente, não se faz isso.
 */

import jenkins.model.Jenkins
import hudson.security.HudsonPrivateSecurityRealm
import hudson.security.FullControlOnceLoggedInAuthorizationStrategy

def jenkins = Jenkins.get()

if (!(jenkins.getSecurityRealm() instanceof HudsonPrivateSecurityRealm)) {
    println "--> Criando usuario admin/admin para a aula..."

    def realm = new HudsonPrivateSecurityRealm(false)
    realm.createAccount("admin", "admin")
    jenkins.setSecurityRealm(realm)

    def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
    strategy.setAllowAnonymousRead(false)
    jenkins.setAuthorizationStrategy(strategy)

    jenkins.save()
    println "--> Pronto! Acesse http://localhost:8081 com admin / admin"
}
