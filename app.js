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

function calcularTotalPedido(pedido, itensPedido, produtos) {

    // Filtra os itens do pedido atual usando o pedido.id
    const itensDoPedido = itensPedido.filter(item => item.pedido === pedido.id);

    if (itensDoPedido.length === 0) {
        console.warn(`Nenhum item encontrado para o pedido ID: ${pedido.id}`);
        return "0.00"; // Retorna "0.00" se nenhum item for encontrado
    }

    // Calcula o total somando os preços dos produtos multiplicados pelas quantidades
    const total = itensDoPedido.reduce((soma, item) => {
        // Encontra o produto correspondente ao item
        const produto = produtos.find(p => p.id === item.produto);
        if (!produto) {
            console.warn(`Produto não encontrado para o produto ID: ${item.produto}`);
            return soma; // Ignora itens sem produto correspondente
        }

        return soma + produto.valor * item.quantidade;
    }, 0);

    return total.toFixed(2); // Retorna o total com 2 casas decimais
}

async function preencherTablePedido() {
    const pedidos = await pedidosApi();
    const clientes = await clientesApi();
    const itemPedido = await itemPedidoApi();
    const produtos = await produtosApi();

    console.log("Pedidos:", pedidos);
    console.log("Clientes:", clientes);
    console.log("Itens do Pedido:", itemPedido);
    console.log("Produtos:", produtos);

    const tabela = document.getElementById("tabelaPedidos");

    for (const pedido of pedidos) {
        if (!pedido.id) {
            console.warn("Pedido sem ID encontrado:", pedido);
            continue; // Pule pedidos sem ID
        }

        // Encontra o cliente associado ao pedido
        const cliente = clientes.find(c => c.id === pedido.cliente);

        // Calcula o total do pedido
        const total = calcularTotalPedido(pedido, itemPedido, produtos);

        // Cria a linha da tabela
        const linha = await linhaTablePedidos(pedido, cliente || { nome: "Desconhecido" }, total);
        tabela.appendChild(linha);
    }
}

async function linhaTablePedidos(pedido, cliente, total) {
    const linha = document.createElement("tr");

    linha.innerHTML = `
        <td>${pedido.id}</td>
        <td>${cliente.nome}</td>
        <td>${pedido.data}</td>
        <td>${total}</td>
    `;
    return linha;
}

preencherTablePedido();
