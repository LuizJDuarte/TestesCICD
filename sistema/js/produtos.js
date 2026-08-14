// Catálogo e carrinho da MiniLoja.
// Dividido em três partes: dados, catálogo e carrinho.

// ---------- 1. Dados ----------

// O estoque é o que cria as regras de erro: produto zerado não pode
// ser adicionado, e ninguém leva mais unidades do que existem.
const PRODUTOS = [
  { nome: "Notebook Pro 14",      categoria: "Computadores", preco: 4500.0, estoque: 2 },
  { nome: "Monitor 24 polegadas", categoria: "Computadores", preco: 1200.0, estoque: 5 },
  { nome: "Teclado Mecânico",     categoria: "Periféricos",  preco: 350.0,  estoque: 10 },
  { nome: "Mouse Gamer",          categoria: "Periféricos",  preco: 199.9,  estoque: 3 },
  { nome: "Headset Sem Fio",      categoria: "Periféricos",  preco: 450.0,  estoque: 0 },
  { nome: "Cadeira Ergonômica",   categoria: "Móveis",       preco: 1800.0, estoque: 1 },
];

const CUPONS = {
  ALUNO10: { desconto: 0.1, expirado: false },
  PROMO2020: { desconto: 0.2, expirado: true },
};

// Estado do carrinho: lista de { nome, preco, quantidade }.
const carrinho = [];
let cupomAplicado = null;

const listaProdutos = document.getElementById("lista-produtos");
const campoBusca = document.getElementById("campo-busca");
const filtroCategoria = document.getElementById("filtro-categoria");
const divMensagemVazio = document.getElementById("mensagem-vazio");

const contadorCarrinho = document.getElementById("contador-carrinho");
const itensCarrinho = document.getElementById("itens-carrinho");
const carrinhoVazio = document.getElementById("carrinho-vazio");
const divMensagemCarrinho = document.getElementById("mensagem-carrinho");
const campoCupom = document.getElementById("campo-cupom");
const subtotalCarrinho = document.getElementById("subtotal-carrinho");
const descontoCarrinho = document.getElementById("desconto-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");

// 1200 vira "R$ 1.200,00". Feito à mão porque o toLocaleString põe um
// espaço especial depois do "R$" em alguns navegadores, e isso quebra
// o teste que compara o texto exato.
function formatarPreco(valor) {
  const partes = valor.toFixed(2).split(".");
  const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "R$ " + inteiro + "," + partes[1];
}

function avisar(texto, tipo) {
  divMensagemCarrinho.textContent = texto;
  divMensagemCarrinho.className = texto ? "aviso " + tipo : "";
}

// ---------- 2. Catálogo ----------

// Redesenha a lista aplicando busca e filtro de categoria juntos.
function desenharProdutos() {
  const termo = campoBusca.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;

  const visiveis = PRODUTOS.filter(function (produto) {
    const combinaBusca = produto.nome.toLowerCase().includes(termo);
    const combinaCategoria = categoria === "Todas" || produto.categoria === categoria;
    return combinaBusca && combinaCategoria;
  });

  listaProdutos.innerHTML = "";

  visiveis.forEach(function (produto) {
    const esgotado = produto.estoque === 0;

    const cartao = document.createElement("div");
    cartao.className = esgotado ? "produto esgotado" : "produto";
    cartao.setAttribute("data-produto", produto.nome);

    cartao.innerHTML =
      '<span class="produto-categoria">' + produto.categoria + "</span>" +
      '<h3 class="produto-nome">' + produto.nome + "</h3>" +
      '<span class="produto-preco">' + formatarPreco(produto.preco) + "</span>" +
      '<span class="produto-estoque">' +
        (esgotado ? "Esgotado" : produto.estoque + " em estoque") +
      "</span>" +
      '<button class="btn-adicionar"' + (esgotado ? " disabled" : "") + ">Adicionar</button>";

    if (!esgotado) {
      cartao.querySelector(".btn-adicionar").addEventListener("click", function () {
        adicionarAoCarrinho(produto);
      });
    }

    listaProdutos.appendChild(cartao);
  });

  divMensagemVazio.textContent = visiveis.length === 0 ? "Nenhum produto encontrado." : "";
}

// ---------- 3. Carrinho ----------

function adicionarAoCarrinho(produto) {
  const item = carrinho.find(function (i) {
    return i.nome === produto.nome;
  });

  const quantidadeNoCarrinho = item ? item.quantidade : 0;

  // Não dá para levar mais do que existe no estoque.
  if (quantidadeNoCarrinho >= produto.estoque) {
    avisar("Estoque insuficiente para " + produto.nome + ".", "erro");
    return;
  }

  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }

  avisar("", "");
  desenharCarrinho();
}

function removerDoCarrinho(nomeDoProduto) {
  const posicao = carrinho.findIndex(function (i) {
    return i.nome === nomeDoProduto;
  });

  if (posicao >= 0) {
    carrinho.splice(posicao, 1);
  }

  avisar("", "");
  desenharCarrinho();
}

function limparCarrinho() {
  carrinho.length = 0;
  cupomAplicado = null;
  campoCupom.value = "";
  avisar("", "");
  desenharCarrinho();
}

function aplicarCupom() {
  const codigo = campoCupom.value.trim().toUpperCase();

  if (carrinho.length === 0) {
    avisar("Adicione produtos antes de aplicar um cupom.", "erro");
    return;
  }

  if (cupomAplicado) {
    avisar("Já existe um cupom aplicado.", "erro");
    return;
  }

  const cupom = CUPONS[codigo];

  if (!cupom) {
    avisar("Cupom inválido.", "erro");
    return;
  }

  if (cupom.expirado) {
    avisar("Cupom expirado.", "erro");
    return;
  }

  cupomAplicado = { codigo: codigo, desconto: cupom.desconto };
  avisar("Cupom " + codigo + " aplicado.", "sucesso");
  desenharCarrinho();
}

function desenharCarrinho() {
  // O contador soma as quantidades, não as linhas: dois teclados iguais
  // aparecem numa linha só, mas contam como 2.
  const totalDeItens = carrinho.reduce(function (soma, item) {
    return soma + item.quantidade;
  }, 0);
  contadorCarrinho.textContent = totalDeItens;

  itensCarrinho.innerHTML = "";
  carrinho.forEach(function (item) {
    const linha = document.createElement("li");
    linha.className = "item-carrinho";
    linha.setAttribute("data-item", item.nome);

    linha.innerHTML =
      '<span class="item-nome">' + item.nome + "</span>" +
      '<span class="item-quantidade">' + item.quantidade + "x</span>" +
      '<span class="item-subtotal">' + formatarPreco(item.preco * item.quantidade) + "</span>" +
      '<button class="btn-remover">Remover</button>';

    linha.querySelector(".btn-remover").addEventListener("click", function () {
      removerDoCarrinho(item.nome);
    });

    itensCarrinho.appendChild(linha);
  });

  const subtotal = carrinho.reduce(function (soma, item) {
    return soma + item.preco * item.quantidade;
  }, 0);
  const desconto = cupomAplicado ? subtotal * cupomAplicado.desconto : 0;

  subtotalCarrinho.textContent = formatarPreco(subtotal);
  descontoCarrinho.textContent = formatarPreco(desconto);
  totalCarrinho.textContent = formatarPreco(subtotal - desconto);

  carrinhoVazio.style.display = carrinho.length === 0 ? "block" : "none";
}

campoBusca.addEventListener("input", desenharProdutos);
filtroCategoria.addEventListener("change", desenharProdutos);
document.getElementById("btn-aplicar-cupom").addEventListener("click", aplicarCupom);
document.getElementById("btn-limpar-carrinho").addEventListener("click", limparCarrinho);

desenharProdutos();
desenharCarrinho();
