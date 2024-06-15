// Função para abrir o modal com as despesas da mesa
function abrirModal(mesaNumero) {
    const modal = document.getElementById('modal');
    const modalMesaNumero = document.getElementById('mesa-numero');
    const modalDespesas = document.getElementById('mesa-despesas');

    // Atualiza o número da mesa no modal
    modalMesaNumero.textContent = mesaNumero;

    // Faz uma requisição para o backend para obter os detalhes da comanda
    axios.get(`http://localhost:3000/comandas/${mesaNumero}`)
        .then(response => {
            const despesas = response.data; // Lista com o nome e o valor total de cada cliente
            console.log(despesas)
            // Calcula o total das despesas da mesa
            if (despesas.message) {
                modalDespesas.textContent = despesas.message;
            } else {
                // Calcula o total das despesas da mesa
                let clienteNome = []
                let totalDespesas = 0;
                despesas.forEach(cliente => {
                    totalDespesas += cliente.valorTotal;
                    clienteNome.push(cliente.nome)
                });

                console.log(clienteNome)
                // Atualiza o total das despesas no modal apenas para a mesa selecionada
                if (clienteNome !== undefined) {
                    modalDespesas.textContent = clienteNome + ' R$' +  totalDespesas.toFixed(2); // Exibe o total com duas casas decimais
                } else {
                    modalDespesas.textContent = 'Nome do cliente indisponível' + ' R$' +  totalDespesas.toFixed(2);
                }
            
            }
        })
        .catch(error => {
            modalDespesas.textContent = 'Não há comandas vinculadas a esta'
            console.error('Erro ao recuperar despesas da mesa:', error);
        })
        .finally(() => {
            // Exibe o modal após a requisição (caso tenha ocorrido algum erro, o modal não será exibido)
            modal.style.display = 'flex'; // Define o estilo display como flex
        });
}

// Evento de clique para abrir o modal ao clicar em uma mesa
document.querySelectorAll('.mesa').forEach(mesa => {
    mesa.addEventListener('click', () => {
        const mesaNumero = mesa.dataset.mesa;
        abrirModal(mesaNumero);
    });
});

// Função para simular o pagamento (adicione sua lógica de pagamento aqui)
function pagar() {
    // Adicione aqui sua lógica para realizar o pagamento
    console.log('Pagamento realizado com sucesso!');
    // Feche o modal após o pagamento
    fecharModal();
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}
