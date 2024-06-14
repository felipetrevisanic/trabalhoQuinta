import comanda from "../model/comanda.js";
import produto from '../model/produto.js';
import bebida from '../model/bebida.js';
import combo from '../model/combo.js';

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
    const {nome, mesa} = req.query;
    try {
      const resultado = await comanda.findOne({mesa: mesa, nome: nome})
      const existe = resultado != null
      res.status(200).send({existes: existe});
    } catch (error) {
      res
        .status(500)
        .send({ message: `${error} - não foi possivel realizar busca` });
    }
  };

  static listaComandaMesa = async (req, res) => {
    try {
        const { mesa } = req.params;

        // Encontrar a comanda correspondente à mesa fornecida
        const comanda = await comanda.findOne({ mesa });

        if (!comanda) {
            return res.status(404).json({ message: 'Comanda não encontrada.' });
        }

        // Preparar os dados dos pedidos separados por cliente
        const pedidosPorCliente = comanda.clientes.map(cliente => {
            let totalProdutos = 0;
            let totalBebidas = 0;
            let totalCombos = 0;

            if (cliente.produtos && cliente.produtos.length > 0) {
                totalProdutos = cliente.produtos.reduce((total, produto) => total + produto.preco, 0);
            }

            if (cliente.bebidas && cliente.bebidas.length > 0) {
                totalBebidas = cliente.bebidas.reduce((total, bebida) => total + bebida.preco, 0);
            }

            if (cliente.combos && cliente.combos.length > 0) {
                totalCombos = cliente.combos.reduce((total, combo) => total + combo.preco, 0);
            }

            const total = totalProdutos + totalBebidas + totalCombos;
            return { nome: cliente.nome, total };
        });

        return res.status(200).json(pedidosPorCliente);
    } catch (error) {
        console.error('Erro ao retornar valores dos pedidos:', error);
        res.status(500).send({ message: 'Erro ao retornar valores dos pedidos.' });
    };
  }  

  static criarcomanda = async (req, res) => {
    console.log('Dados recebidos:', req.body);
    try {
        const { nome, mesa, produtos, bebidas, combos, comentarios } = req.body;

        // Verificar se existe uma comanda com o mesmo nome e mesa
        const comandaExistente = await comanda.findOne({ nome, mesa });

        if (comandaExistente) {
            console.log('Comanda existe');

            // Atualizar a comanda existente com os dados fornecidos
            if (produtos && produtos.length > 0) {
                const produtosObjetos = await produto.find({ _id: { $in: produtos } });
                comandaExistente.produtos.push(...produtosObjetos);
            }

            if (bebidas && bebidas.length > 0) {
                const bebidasObjetos = await bebida.find({ _id: { $in: bebidas } });
                comandaExistente.bebidas.push(...bebidasObjetos);
            }

            if (combos && combos.length > 0) {
                const combosObjetos = await combo.find({ _id: { $in: combos } });
                comandaExistente.combos.push(...combosObjetos);
            }

            if (comentarios) {
                comandaExistente.comentarios.push(comentarios);
            }

            await comandaExistente.save();
            return res.status(200).json({ message: 'Comanda atualizada com sucesso.' });
        } else {
            console.log('Comanda não existe');

            // Criar uma nova comanda com os dados recebidos
            const novaComanda = new comanda({
                nome,
                mesa,
                clientes: [{
                    nome,
                    produtos: produtos ? await produto.find({ _id: { $in: produtos } }) : [],
                    bebidas: bebidas ? await bebida.find({ _id: { $in: bebidas } }) : [],
                    combos: combos ? await combo.find({ _id: { $in: combos } }) : [],
                    comentarios: comentarios ? [comentarios] : []
                }]
            });

            await novaComanda.save();
            return res.status(201).json({ message: 'Comanda criada com sucesso.' });
        }
    } catch (error) {
        console.error('Erro ao criar comanda:', error);
        res.status(500).send({ message: 'Não foi possível inserir a comanda.' });
    }
};


//   static criarcomanda = async (req, res) => {
//     console.log('Dados recebidos:', req.body);
//     try {
//         const { nome, mesa, produtos, bebidas, combos, comentarios } = req.body;

//         // Verificar se existe uma comanda com o mesmo nome e mesa
//         const comandaExistente = await comanda.findOne({ nome, mesa });

//         if (comandaExistente) {
//             console.log('Comanda existe');

//             // Adicionar produtos, bebidas, combos e comentários à comanda existente
//             if (produtos && produtos.length > 0) {
//                 const produtosObjetos = await produto.find({ _id: { $in: produtos } });
//                 comandaExistente.produtos.push(...produtosObjetos);
//             }

//             if (bebidas && bebidas.length > 0) {
//                 const bebidasObjetos = await bebida.find({ _id: { $in: bebidas } });
//                 comandaExistente.bebidas.push(...bebidasObjetos);
//             }

//             if (combos && combos.length > 0) {
//                 const combosObjetos = await combo.find({ _id: { $in: combos } });
//                 comandaExistente.combos.push(...combosObjetos);
//             }

//             if (comentarios) {
//                 comandaExistente.comentarios.push(comentarios);
//             }

//             await comandaExistente.save();
//             return res.status(200).json({ message: 'Comanda atualizada com sucesso.' });
//         } else {
//             console.log('Comanda não existe');

//             // Criar uma nova comanda com os dados recebidos
//             const novaComanda = new comanda({
//                 nome,
//                 mesa,
//                 produtos: produtos ? await produto.find({ _id: { $in: produtos } }) : [],
//                 bebidas: bebidas ? await bebida.find({ _id: { $in: bebidas } }) : [],
//                 combos: combos ? await combo.find({ _id: { $in: combos } }) : [],
//                 comentarios: comentarios ? [comentarios] : []
//             });

//             await novaComanda.save();
//             return res.status(201).json({ message: 'Comanda criada com sucesso.' });
//         }
//     } catch (error) {
//         res.status(500).send({ message: `${error} - não foi possível inserir a comanda` });
//     }
// };

  
  // static criarcomanda = async (req, res) => {
  //   console.log('Dados recebidos:', req.body);
  //   try {
  //     const { nome, mesa, produtos, bebidas, combos } = req.body;
  //     const produtosObjetos = await produto.find({ _id: { $in: produtos } });
  //     const bebidasObjetos = await bebida.find({ _id: { $in: bebidas } });
  //     const combosObjetos = await combo.find({ _id: { $in: combos } });
        
  //       const comandaExistente = await comanda.findOne({ nome, mesa });

  //       if (comandaExistente) {
  //           console.log('comanda existe')
  //           comandaExistente.produtos.push() = produtosObjetos;
  //           comandaExistente.bebidas.push() = bebidasObjetos;
  //           comandaExistente.combos.push() = combosObjetos;
  //           await comandaExistente.save();
  //           return res.status(200).json({ message: 'Comanda atualizada com sucesso.' });
  //         } 
  //         else {
  //           console.log('comanda nao existe')
  //           const novaComanda = new comanda(req.body);
  //           await novaComanda.save();
  //           return res.status(201).json({ message: 'Comanda criada com sucesso.' });
  //         }
            
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .send({ message: `${error} - não foi possivel inserir o comanda` });
  //   }
  // };

  static Atualizarcomanda = async (req, res) => {
    const id = req.params.id;
    try {
      await comanda.findByIdAndUpdate(id, { $set: req.body });
      res.status(200).send({ message: "comanda atualizado com sucesso" });
    } catch (error) {
      res
        .status(500)
        .send({ message: `${error} - não foi possivel atulizar comanda` });
    }
  };

  static excluircomanda = async (req, res) => {
    const id = req.params.id;
    try {
      await comanda.findByIdAndDelete(id);
      res.status(200).send({ message: `comanda excluido com sucesso` });
    } catch (error) {
      res
        .status(500)
        .send({ message: `${error} - não foi possivel excluir comanda` });
    }
  };
}

export default comandaController;