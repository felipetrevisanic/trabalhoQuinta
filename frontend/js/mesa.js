// Função para abrir o modal com as despesas da mesa
function abrirModal(mesaNumero) {
    const modal = document.getElementById('modal');
    const modalMesaNumero = document.getElementById('mesa-numero');
    const modalDespesas = document.getElementById('mesa-despesas');


    
    // Atualiza o número da mesa no modal
    modalMesaNumero.textContent = mesaNumero;

    console.log(mesaNumero)

    // Faz uma requisição para o backend para obter os detalhes da comanda
    axios.get(`http://localhost:3000/comandas?mesa=${mesaNumero}`)
        .then(response => {
            const comanda = response.data[0]; // Supondo que apenas uma comanda seja retornada

            // Calcula o total das despesas (produtos, bebidas e combos)
            let totalDespesas = 0;

            // Verifica se há produtos e calcula o total
            if (comanda.produtos && comanda.produtos.length > 0) {
                comanda.produtos.forEach(produto => {
                    if (produto.valor) { // Verifica se o valor está definido
                        totalDespesas += produto.valor;
                    }
                });
            }

            // Verifica se há bebidas e calcula o total
            if (comanda.bebidas && comanda.bebidas.length > 0) {
                comanda.bebidas.forEach(bebida => {
                    if (bebida.valor) { // Verifica se o valor está definido
                        totalDespesas += bebida.valor;
                    }
                });
            }

            // Verifica se há combos e calcula o total
            if (comanda.combos && comanda.combos.length > 0) {
                comanda.combos.forEach(combo => {
                    if (combo.valor) { // Verifica se o valor está definido
                        totalDespesas += combo.valor;
                    }
                });
            }

            // Atualiza o total das despesas no modal apenas para a mesa selecionada
            modalDespesas.textContent = totalDespesas.toFixed(2); // Exibe o total com duas casas decimais
        })
        .catch(error => {
            console.error('Erro ao recuperar despesas da mesa:', error);
        })
        .finally(() => {
            // Exibe o modal após a requisição (caso tenha ocorrido algum erro, o modal não será exibido)
            modal.style.display = 'flex'; // Define o estilo display como flex
        });
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
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
