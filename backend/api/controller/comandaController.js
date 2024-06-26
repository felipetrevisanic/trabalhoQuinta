import comanda from "../model/comanda.js";
import produto from '../model/produto.js'
import bebida from '../model/bebida.js'
import combo from '../model/combo.js'


class comandaController {
  static listarcomanda = async (req, res) => {
    try {
      const listar = await comanda.find();
      res.status(200).json(listar);
    } catch (error) {
      res
        .status(500)
        .send({ message: `${error} - não foi possivel realizar as busca` });
    }
  };

  static verificarSeExistePessoaNaComanda = async (req, res) => {
    try {
        const { mesa } = req.params;
        // Usar populate para carregar os detalhes dos produtos, bebidas e combos
        const comandaExistente = await comanda.findOne({ mesa })
            .populate('cliente.produtos')
            .populate('cliente.bebidas')
            .populate('cliente.combos');

        if (!comandaExistente) {
            return res.status(404).json({ message: 'Comanda não encontrada.' });
        }

        const resultados = comandaExistente.cliente.map(cliente => {
          const produtos = cliente.produtos.filter(produto => produto.valor !== null);
          const bebidas = cliente.bebidas.filter(bebida => bebida.valor !== null);
          const combos = cliente.combos.filter(combo => combo.valor !== null);
      
          const totalProdutos = produtos.reduce((acc, produto) => acc + produto.valor, 0);
          const totalBebidas = bebidas.reduce((acc, bebida) => acc + bebida.valor, 0);
          const totalCombos = combos.reduce((acc, combo) => acc + combo.valor, 0);
      
          const valorTotal = totalProdutos + totalBebidas + totalCombos;
      
          console.log(produtos);
          console.log(totalProdutos);
          console.log(totalBebidas);
          console.log(totalCombos);
      
          return {
              nome: cliente.nome,
              valorTotal: valorTotal
          };
      });
        console.log(resultados);

        return res.status(200).json(resultados);
    } catch (error) {
        console.error('Erro ao obter valor total da comanda:', error);
        res.status(500).send({ message: 'Não foi possível obter o valor total da comanda.' });
    }
};

static listaComandaMesa = async (req, res) => {
  try {
      const { mesa } = req.params;

      // Encontrar a comanda correspondente à mesa fornecida
      const comandaExistente = await comanda.findOne({ mesa: parseInt(mesa, 10) });

      if (!comandaExistente) {
          
        return res.status(404).json({ message: 'Mesa não possui comanda vinculada.' });
      }

      // Preparar os dados dos pedidos separados por cliente
      const pedidosPorCliente = comandaExistente.clientes.map(cliente => {
          const totalProdutos = cliente.produtos.reduce((total, produto) => total + produto.preco, 0);
          const totalBebidas = cliente.bebidas.reduce((total, bebida) => total + bebida.preco, 0);
          const totalCombos = cliente.combos.reduce((total, combo) => total + combo.preco, 0);

          const total = totalProdutos + totalBebidas + totalCombos;
          return { nome: cliente.nome, total };
      });

      return res.status(200).json(pedidosPorCliente);
  } catch (error) {
      console.error('Erro ao retornar valores dos pedidos:', error);
      return res.status(500).send({ message: 'Erro ao retornar valores dos pedidos.' });
  }
};


  
static criarcomanda = async (req, res) => {
  console.log('Dados recebidos:', req.body);
  try {
      const { mesa, cliente } = req.body;

      // Verificar se existe uma comanda para a mesma mesa
      const comandaExistente = await comanda.findOne({ mesa });

      if (comandaExistente) {
        console.log('Comanda existe');
    
        // Buscar os detalhes dos produtos, bebidas e combos no banco de dados
        const produtos = await produto.find({ _id: { $in: cliente.produtos } });
        const bebidas = await bebida.find({ _id: { $in: cliente.bebidas } });
        const combos = await combo.find({ _id: { $in: cliente.combos } });
    
        // Atualizar a comanda existente com os dados fornecidos
        let clienteExistente = comandaExistente.cliente.find(c => c.nome === cliente.nome);
    
        if (clienteExistente) {
            // Atualizar os detalhes do cliente existente
            if (cliente.produtos && cliente.produtos.length > 0) {
                clienteExistente.produtos.push(...produtos);
            }
    
            if (cliente.bebidas && cliente.bebidas.length > 0) {
                clienteExistente.bebidas.push(...bebidas);
            }
    
            if (cliente.combos && cliente.combos.length > 0) {
                clienteExistente.combos.push(...combos);
            }
    
            if (cliente.comentarios && cliente.comentarios.length > 0) {
                clienteExistente.comentarios.push(...cliente.comentarios);
            }
        } else {
            // Adicionar novo cliente se não existir
            const novoClienteObj = {
                nome: cliente.nome,
                produtos: produtos || [],
                bebidas: bebidas || [],
                combos: combos || [],
                comentarios: cliente.comentario || []
            };
            console.log('Novo cliente adicionado:', novoClienteObj);
            comandaExistente.cliente.push(novoClienteObj);
        }
        console.log('Comanda existente:', comandaExistente);
    
        await comandaExistente.save();
        return res.status(200).json({ message: 'Comanda atualizada com sucesso.' });
    } else {
        console.log('Comanda não existe');
    
        // Buscar os detalhes dos produtos, bebidas e combos no banco de dados
        const produtos = await produto.find({ _id: { $in: cliente.produtos } });
        const bebidas = await bebida.find({ _id: { $in: cliente.bebidas } });
        const combos = await combo.find({ _id: { $in: cliente.combos } });
    
        const novoClienteObj = {
            nome: cliente.nome,
            produtos,
            bebidas,
            combos,
            comentarios: cliente.comentarios || []
        };
    
        // Criar uma nova comanda com os dados construídos
        const novaComanda = new comanda({
            mesa: parseInt(mesa, 10), // Converter 'mesa' para número
            cliente: [novoClienteObj] // Aqui, fornecemos o novo cliente em um array
        });
    
        await novaComanda.save();
        return res.status(201).json({ message: 'Comanda criada com sucesso.' });
    }
  } catch (error) {
      console.error('Erro ao criar comanda:', error);
      res.status(500).send({ message: 'Não foi possível inserir a comanda.' });
  }
};


static Atualizarcomanda = async (req, res) => {
  const mesa = req.params.mesa;
  const { nomeCliente } = req.body;

  try {
    const novaComanda = await comanda.findOne({ mesa: mesa });
    if (!novaComanda) {
      return res.status(404).send({ message: 'Comanda não encontrada' });
    }

    // Remove o cliente da lista de clientes
    novaComanda.cliente = novaComanda.cliente.filter(cliente => cliente.nome !== nomeCliente);

    // Se não houver mais clientes, exclui a comanda
    if (novaComanda.cliente.length === 0) {
      await comanda.findOneAndDelete({ mesa: mesa });
      return res.status(200).send({ message: 'Comanda excluída com sucesso' });
    }

    // Salva a comanda atualizada
    await novaComanda.save();
    res.status(200).send({ message: 'Cliente removido e comanda atualizada com sucesso' });
  } catch (error) {
    console.error(error); // Adicione esta linha para logar o erro no servidor
    res.status(500).send({ message: `${error} - Não foi possível atualizar a comanda` });
  }
};

static excluircomanda = async (req, res) => {
  const mesa = req.params.mesa;
  try {
    await comanda.findOneAndDelete({ mesa: mesa });
    res.status(200).send({ message: 'Comanda excluída com sucesso' });
  } catch (error) {
    console.error(error); // Adicione esta linha para logar o erro no servidor
    res.status(500).send({ message: `${error} - Não foi possível excluir a comanda` });
  }
};
}

export default comandaController;