const produto = document.getElementById('produtos')
const bebida = document.getElementById('bebidas')
const combo = document.getElementById('combos')
const mesa = document.getElementById('mesa')
const nome = document.getElementById('nome')
const comentario = document.getElementById('comentarios')
const btn = document.getElementById('botao')

btn.addEventListener('click', () =>{
    console.log('funcionou')
    enviarDados()
})

chamaDados()


function enviarDados(){
    
    const Url = 'http://localhost:3000'; // Altere o URL conforme necessário

    const pedido = {
        mesa: mesa.value,
        cliente: {
            nome: nome.value,
            produtos: [produto.value], // Supondo que produto, bebida e combo sejam IDs ou algo similar
            bebidas: [bebida.value],
            combos: [combo.value],
            comentarios: [comentario.value]
        }
    };
    
    console.log('Pedido:', pedido);
    
    axios.post(`${Url}/comandas`, pedido)
        .then((response) => {
            console.log('Resposta do servidor:', response.data);
            alert('Pedido enviado com sucesso!');
        })
        .catch((error) => {
            console.error('Erro ao enviar pedido:', error);
            alert('Erro ao enviar pedido. Por favor, tente novamente mais tarde.');
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