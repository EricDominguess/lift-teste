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

async function preencherTabela() {
    const pedidos = await pedidosApi();
    const clientes = await clientesApi();

    const tabela = document.getElementById("tabelaPedidos").querySelector("tbody");
    tabela.innerHTML = "";

    
    pedidos.forEach(pedido => {
        const linha = document.createElement("tr");

        const colunaPedido = document.createElement("td");
        colunaPedido.textContent = pedido.id;
        linha.appendChild(colunaPedido);

        const cliente = clientes.find(clientes => clientes.id === pedido.cliente)
        const colunaCliente = document.createElement("td");
        colunaCliente.textContent = cliente ? cliente.nome : "Desconhecido";
        linha.appendChild(colunaCliente);

        const colunaData = document.createElement("td");
        colunaData.textContent = pedido.data;
        linha.appendChild(colunaData);

        const colunaValor = document.createElement("td");
        colunaValor.textContent = pedido.valor;
        linha.appendChild(colunaValor);

        tabela.appendChild(linha);
        
    });
}

preencherTabela();
itemPedidoApi();