// Tela de cadastro.
// As regras de validação ficam todas dentro da função validar().

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAMANHO_MINIMO_NOME = 3;
const TAMANHO_MINIMO_SENHA = 6;

// Faz o papel do banco de dados.
const EMAILS_JA_CADASTRADOS = ["admin@admin.com", "maria@empresa.com"];

const campos = {
  nome: document.getElementById("nome"),
  email: document.getElementById("email-cadastro"),
  senha: document.getElementById("senha-cadastro"),
  confirmacao: document.getElementById("confirmar-senha"),
  termos: document.getElementById("aceitar-termos"),
};

const spansDeErro = {
  nome: document.getElementById("erro-nome"),
  email: document.getElementById("erro-email"),
  senha: document.getElementById("erro-senha"),
  confirmacao: document.getElementById("erro-confirmacao"),
  termos: document.getElementById("erro-termos"),
};

const divSucesso = document.getElementById("mensagem-sucesso");

// Devolve um objeto só com os campos que estão errados.
// Se voltar vazio, o cadastro é válido.
function validar(dados) {
  const erros = {};
  const email = dados.email.toLowerCase();

  if (dados.nome.length < TAMANHO_MINIMO_NOME) {
    erros.nome = "O nome deve ter pelo menos 3 caracteres.";
  }

  // Um erro por campo: não faz sentido dizer que o e-mail está mal
  // escrito e que ele já existe ao mesmo tempo.
  if (!FORMATO_EMAIL.test(email)) {
    erros.email = "E-mail em formato inválido.";
  } else if (EMAILS_JA_CADASTRADOS.includes(email)) {
    erros.email = "Este e-mail já está cadastrado.";
  }

  if (dados.senha.length < TAMANHO_MINIMO_SENHA) {
    erros.senha = "A senha deve ter pelo menos 6 caracteres.";
  } else if (dados.senha !== dados.confirmacao) {
    erros.confirmacao = "As senhas não conferem.";
  }

  if (!dados.aceitouTermos) {
    erros.termos = "É preciso aceitar os termos de uso.";
  }

  return erros;
}

function limparErros() {
  Object.keys(spansDeErro).forEach(function (campo) {
    spansDeErro[campo].textContent = "";
  });
}

function mostrarErros(erros) {
  Object.keys(erros).forEach(function (campo) {
    spansDeErro[campo].textContent = erros[campo];
  });
}

document.getElementById("btn-cadastrar").addEventListener("click", function () {
  const dados = {
    nome: campos.nome.value.trim(),
    email: campos.email.value.trim(),
    senha: campos.senha.value,
    confirmacao: campos.confirmacao.value,
    aceitouTermos: campos.termos.checked,
  };

  limparErros();
  divSucesso.textContent = "";

  const erros = validar(dados);

  if (Object.keys(erros).length > 0) {
    mostrarErros(erros);
    return;
  }

  divSucesso.textContent = "Cadastro realizado com sucesso!";
});
