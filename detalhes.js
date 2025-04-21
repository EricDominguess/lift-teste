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

    // Verifica se o pedido tem itens associados
    const total = itensDoPedido.reduce((soma, item) => {
        
        const produto = produtos.find(p => p.id === item.produto);
        if (!produto) {
            console.warn(`Produto não encontrado para o produto ID: ${item.produto}`);
            return soma; 
        }

        return soma + produto.valor * item.quantidade;
    }, 0);

    return total.toFixed(2); 
}

const urlParams = new URLSearchParams(window.location.search);
const pedidoId = urlParams.get('pedidoId');

async function preencherDetalhesPedido() {
    const pedidos = await pedidosApi(); 
    const clientes = await clientesApi(); 
    const itensPedido = await itemPedidoApi(); 
    const produtos = await produtosApi(); 

    // Encontra o pedido atual
    const pedido = pedidos.find(p => p.id === parseInt(pedidoId));
    if (!pedido) {
        console.error("Pedido não encontrado!");
        return;
    }

    // Encontra o cliente associado ao pedido
    const cliente = clientes.find(c => c.id === pedido.cliente);
    if (cliente) {
        document.getElementById("nomeCliente").textContent = cliente.nome || "Não Informado";
        document.getElementById("cpfCliente").textContent = cliente.cpf || "Não Informado";
        document.getElementById("Data_Pedido").textContent = pedido.data || "Não Informado";
        document.getElementById("emailCliente").textContent = cliente.email || "Não Informado";
    } else {
        console.warn("Cliente não encontrado!");
    }

    // Filtra os itens do pedido atual
    const itensDoPedido = itensPedido.filter(item => item.pedido === parseInt(pedidoId));

    const tabelaItens = document.getElementById("itensDoPedido").querySelector("tbody");
    tabelaItens.innerHTML = "";

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

    const total = calcularTotalPedido(pedido, itensPedido, produtos);
    document.getElementById("totalPedido").innerHTML = `<strong>Total: </strong> R$ ${total}`;
}

preencherDetalhesPedido();