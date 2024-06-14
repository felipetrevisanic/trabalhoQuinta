const produto = document.getElementById('produtos')
const bebida = document.getElementById('bebidas')
const combo = document.getElementById('combos')
const mesa = document.getElementById('mesa')
const nome = document.getElementById('nome')
const comentario = document.getElementById('comentarios')
const btn = document.getElementById('botao')

btn.addEventListener('click', () =>{
    enviarDados()
})

chamaDados()


function enviarDados(){
    
        const Url = 'http://localhost:3000'

        const pedido = {
            produto: document.getElementById('produtos').value,
            bebida: document.getElementById('bebidas').value,
            combo: document.getElementById('combos').value,
            mesa: document.getElementById('mesa').value,
            nome: document.getElementById('nome').value,
            comentario: document.getElementById('comentarios').value
          };

        
       
        console.log(pedido)

        
        axios.get(`${Url}/comandas`)
        .then((response) => {
            if (response.data.length > 0) {
                // Mesa já existe, adicionar os itens ao array correspondente
                const mesaExistente = response.data[0];
                const updateData = {};

                if (pedido.produto && pedido.produto_id) {
                    updateData.produtos = mesaExistente.produtos || [];
                    updateData.produtos.push({ nome: pedido.produto, id: pedido.produto_id });
                }

                if (pedido.bebida && pedido.bebida_id) {
                    updateData.bebidas = mesaExistente.bebidas || [];
                    updateData.bebidas.push({ nome: pedido.bebida, id: pedido.bebida_id });
                }

                if (pedido.combo && pedido.combo_id) {
                    updateData.combos = mesaExistente.combos || [];
                    updateData.combos.push({ nome: pedido.combo, id: pedido.combo_id });
                }

                if (pedido.comentarios) {
                    updateData.comentario = mesaExistente.comentario || [];
                    updateData.comentario.push(pedido.comentario);
                }

                // Atualizar a mesa existente com os novos dados
                axios.put(`${Url}/comandas/${mesaExistente._id}`, updateData)
                    .then((response) => {
                        console.log(response.data);
                        alert('Pedido enviado com sucesso!');
                    })
                    .catch((error) => {
                        console.error('Erro ao enviar pedido:', error);
                        alert('Erro ao enviar pedido. Por favor, tente novamente mais tarde.');
                    });
            } else {
                // Mesa não existe, criar uma nova mesa com os dados do pedido
                const novaMesa = {
                    nome: pedido.mesa,
                    produtos: pedido.produto && pedido.produto_id ? [{ nome: pedido.produto, id: pedido.produto_id }] : [],
                    bebidas: pedido.bebida && pedido.bebida_id ? [{ nome: pedido.bebida, id: pedido.bebida_id }] : [],
                    combos: pedido.combo && pedido.combo_id ? [{ nome: pedido.combo, id: pedido.combo_id }] : [],
                    comentarios: pedido.comentario ? [pedido.comentario] : []
                };

                // Criar a nova mesa
                axios.post(`${Url}/comandas`, novaMesa)
                    .then((response) => {
                        console.log(response.data);
                        alert('Pedido enviado com sucesso!');
                    })
                    .catch((error) => {
                        console.error('Erro ao enviar pedido:', error);
                        alert('Erro ao enviar pedido. Por favor, tente novamente mais tarde.');
                    });
            }
        })
        .catch((error) => {
            console.error('Erro ao verificar mesa:', error);
            alert('Erro ao verificar mesa. Por favor, tente novamente mais tarde.');
        });
    
}


function chamaDados(){
    document.addEventListener('DOMContentLoaded', () => {
        const Url = 'http://localhost:3000'

        const comida = document.getElementById('produtos');
        const bebida = document.getElementById('bebidas');
        const combo = document.getElementById('combos');



        axios.get(Url+'/produtos')
            .then((response) => {
                comida.innerHTML = '<option value="">Selecione...</option>'
                const dados = response.data
                
                if(dados.length>0){
                    dados.forEach(item => {
                        const option = document.createElement('option')
                        option.value = item._id;
                        option.textContent = `${item.produto} - Valor: R$${item.valor.toFixed(2)}`
                        comida.appendChild(option)
                    })
                }
                else{
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'sem produtos cadastrados';
                    comida.appendChild(option);
                }
            })
            .catch((error) => {
                console.error('erro na recuperação de dados:', error);
                // Adicionar uma opção de erro
                comida.innerHTML = '<option value="">Error</option>';
            }) 
            //campo de bebidas
        axios.get(Url+'/bebidas')
            .then((response) => {
                bebida.innerHTML = '<option value="">Selecione...</option>'
                const dados = response.data
            
                if(dados.length>0){
                    dados.forEach(item => {
                        const option = document.createElement('option')
                        option.value = item._id;
                        option.textContent = `${item.bebida} - Valor: R$${item.valor.toFixed(2)}`
                        bebida.appendChild(option)
                    })
                }
                else{
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'sem produtos cadastrados';
                    bebida.appendChild(option);
                }
            })
            .catch((error) => {
                console.error('erro na recuperação de dados:', error);
                // Adicionar uma opção de erro
                bebida.innerHTML = '<option value="">Error</option>';
            }) 

            //campo de combos
        axios.get(Url+'/combos')
            .then((response) => {
                combo.innerHTML = '<option value="">Selecione...</option>'
                const dados = response.data
                
                if(dados.length>0){
                    dados.forEach(item => {
                        const option = document.createElement('option')
                        option.value = item._id;
                        option.textContent = `${item.combo} - Valor: R$${item.valor.toFixed(2)}`
                        combo.appendChild(option)
                    })
                }
                else{
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'sem produtos cadastrados';
                    combo.appendChild(option);
                }
            })
            .catch((error) => {
                console.error('erro na recuperação de dados:', error);
                // Adicionar uma opção de erro
                combo.innerHTML = '<option value="">Error</option>';
            }) 
    })
}