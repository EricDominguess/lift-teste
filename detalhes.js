const URL = "https://sistemalift1.com.br/lift_ps/api/";

async function pedidosApi() {
    const resp = await fetch(URL + "Pedidos");
    if (resp.status === 200) {
        const pedidos = await resp.json();
        return pedidos;
    }
}

async function clientesApi() {
    const resp = await fetch(URL + "Clientes");
    if (resp.status === 200) {
        const clientes = await resp.json();
        return clientes;
    }
}

async function itemPedidoApi() {
    const resp = await fetch(URL + "ItensPedido");
    if (resp.status === 200) {
        const itemPedido = await resp.json();
        return itemPedido;
    }
}

async function produtosApi() {
    const resp = await fetch(URL + "Produtos");
    if (resp.status === 200) {
        const produtos = await resp.json();
        return produtos;
    }
}

// Captura o parâmetro 'pedidoId' da URL
const urlParams = new URLSearchParams(window.location.search);
const pedidoId = urlParams.get('pedidoId');

// Função para buscar e exibir as informações do cliente e os itens do pedido
async function preencherDetalhesPedido() {
    const pedidos = await pedidosApi(); // Reutilize a função existente
    const clientes = await clientesApi(); // Reutilize a função existente
    const itensPedido = await itemPedidoApi(); // Reutilize a função existente
    const produtos = await produtosApi(); // Reutilize a função existente

    // Encontra o pedido atual
    const pedido = pedidos.find(p => p.id === parseInt(pedidoId));
    if (!pedido) {
        console.error("Pedido não encontrado!");
        return;
    }

    // Encontra o cliente associado ao pedido
    const cliente = clientes.find(c => c.id === pedido.cliente);
    if (cliente) {
        const clienteTabela = document.getElementById("dadosCliente").querySelector("tbody");
        clienteTabela.innerHTML = `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf || "Não informado"}</td>
                <td>${pedido.data}</td>
                <td>${cliente.email || "Não informado"}</td>
            </tr>
        `;
    } else {
        console.warn("Cliente não encontrado para o pedido!");
    }

    // Filtra os itens do pedido atual
    const itensDoPedido = itensPedido.filter(item => item.pedido === parseInt(pedidoId));

    const tabelaItens = document.getElementById("itensDoPedido").querySelector("tbody");
    tabelaItens.innerHTML = ""; // Limpa a tabela antes de preenchê-la

    itensDoPedido.forEach(item => {
        const produto = produtos.find(p => p.id === item.produto);

        if (produto) {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${item.quantidade}</td>
                <td>${(produto.valor * item.quantidade).toFixed(2)}</td>
            `;
            tabelaItens.appendChild(linha);
        }
    });
}

preencherDetalhesPedido();