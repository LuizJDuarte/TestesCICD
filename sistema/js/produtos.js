/* ============================================================
   Tela de PRODUTOS.

   Aqui acontecem as coisas mais interessantes de testar:
     - a lista é desenhada pelo JavaScript (não está no HTML)
     - existe busca por texto
     - existe filtro por categoria
     - existe um carrinho que muda de valor conforme você clica

   Repare: o teste E2E não sabe (nem se importa) que a lista é
   gerada por JavaScript. Ele olha só para o que aparece na tela.
   ============================================================ */

// "Banco de dados" do nosso catálogo
const PRODUTOS = [
  { nome: "Notebook Pro 14",     categoria: "Computadores", preco: 4500.0 },
  { nome: "Monitor 24 polegadas", categoria: "Computadores", preco: 1200.0 },
  { nome: "Teclado Mecânico",    categoria: "Periféricos",  preco: 350.0 },
  { nome: "Mouse Gamer",         categoria: "Periféricos",  preco: 199.9 },
  { nome: "Headset Sem Fio",     categoria: "Periféricos",  preco: 450.0 },
  { nome: "Cadeira Ergonômica",  categoria: "Móveis",       preco: 1800.0 },
];

// O carrinho começa vazio
const carrinho = [];

const listaProdutos = document.getElementById("lista-produtos");
const campoBusca = document.getElementById("campo-busca");
const filtroCategoria = document.getElementById("filtro-categoria");
const divMensagemVazio = document.getElementById("mensagem-vazio");
const contadorCarrinho = document.getElementById("contador-carrinho");
const itensCarrinho = document.getElementById("itens-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");
const carrinhoVazio = document.getElementById("carrinho-vazio");

/* ------------------------------------------------------------
   Formata 1200 -> "R$ 1.200,00"
   Feito à mão de propósito: assim o texto é SEMPRE igual,
   em qualquer navegador. Testes odeiam surpresas.
   ------------------------------------------------------------ */
function formatarPreco(valor) {
  const partes = valor.toFixed(2).split(".");
  const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "R$ " + inteiro + "," + partes[1];
}

/* ------------------------------------------------------------
   Desenha na tela apenas os produtos que passam pelo
   filtro de busca E pelo filtro de categoria.
   ------------------------------------------------------------ */
function desenharProdutos() {
  const termo = campoBusca.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;

  const visiveis = PRODUTOS.filter(function (produto) {
    const combinaBusca = produto.nome.toLowerCase().includes(termo);
    const combinaCategoria = categoria === "Todas" || produto.categoria === categoria;
    return combinaBusca && combinaCategoria;
  });

  // Limpa a lista antes de redesenhar
  listaProdutos.innerHTML = "";

  visiveis.forEach(function (produto) {
    const cartao = document.createElement("div");
    cartao.className = "produto";
    cartao.setAttribute("data-produto", produto.nome);

    cartao.innerHTML =
      '<span class="produto-categoria">' + produto.categoria + "</span>" +
      '<h3 class="produto-nome">' + produto.nome + "</h3>" +
      '<span class="produto-preco">' + formatarPreco(produto.preco) + "</span>" +
      '<button class="btn-adicionar">Adicionar</button>';

    cartao.querySelector(".btn-adicionar").addEventListener("click", function () {
      adicionarAoCarrinho(produto);
    });

    listaProdutos.appendChild(cartao);
  });

  // Mensagem de "nada encontrado"
  divMensagemVazio.textContent = visiveis.length === 0 ? "Nenhum produto encontrado." : "";
}

/* ------------------------------------------------------------
   Carrinho
   ------------------------------------------------------------ */
function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  desenharCarrinho();
}

function desenharCarrinho() {
  contadorCarrinho.textContent = carrinho.length;

  itensCarrinho.innerHTML = "";
  carrinho.forEach(function (produto) {
    const item = document.createElement("li");
    item.className = "item-carrinho";
    item.textContent = produto.nome + " — " + formatarPreco(produto.preco);
    itensCarrinho.appendChild(item);
  });

  const total = carrinho.reduce(function (soma, produto) {
    return soma + produto.preco;
  }, 0);
  totalCarrinho.textContent = formatarPreco(total);

  // Esconde o aviso de carrinho vazio quando há itens
  carrinhoVazio.style.display = carrinho.length === 0 ? "block" : "none";
}

/* ------------------------------------------------------------
   Liga os eventos e desenha a tela pela primeira vez
   ------------------------------------------------------------ */
campoBusca.addEventListener("input", desenharProdutos);
filtroCategoria.addEventListener("change", desenharProdutos);

desenharProdutos();
desenharCarrinho();
