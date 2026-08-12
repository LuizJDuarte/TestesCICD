/* ============================================================
   Roda automaticamente na PRIMEIRA vez que o Jenkins sobe.

   Cria o usuário:   admin
   Com a senha:      admin

   Isso evita ter que caçar a senha secreta no log do container
   na frente da turma. (Em produção, nunca use admin/admin!)
   ============================================================ */

import jenkins.model.Jenkins
import hudson.security.HudsonPrivateSecurityRealm
import hudson.security.FullControlOnceLoggedInAuthorizationStrategy

def jenkins = Jenkins.get()

// Só cria o usuário se ainda não existir nenhum
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
