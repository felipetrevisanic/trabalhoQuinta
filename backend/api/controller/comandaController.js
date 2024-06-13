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


  // static listarcomandaPorId = async (req, res) => {
  //   const id = req.params.id;
  //   try {
  //     const resultado = await comanda.findById(id);
  //     res.status(200).send(resultado);
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .send({ message: `${error} - não foi possivel realizar busca` });
  //   }
  // };

  // static criarcomanda = async (req, res) => {
  //   let comanda = new comanda(req.body);
  //   try {
  //     comanda.save();
  //     res.status(201).send(comanda.toJSON());
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .send({ message: `${error} - não foi possivel inserir o comanda` });
  //   }
  // };

  static criarcomanda = async (req, res) => {
    console.log('Dados recebidos:', req.body);
    try {
      const { nome, mesa, produtos, bebidas, combos } = req.body;
      const produtosObjetos = await produto.find({ _id: { $in: produtos } });
      const bebidasObjetos = await bebida.find({ _id: { $in: bebidas } });
      const combosObjetos = await combo.find({ _id: { $in: combos } });
        
        const comandaExistente = await comanda.findOne({ nome, mesa });

        if (comandaExistente) {
            console.log('comanda existe')
            comandaExistente.produtos = produtosObjetos;
            comandaExistente.bebidas = bebidasObjetos;
            comandaExistente.combos = combosObjetos;
            await comandaExistente.save();
            return res.status(200).json({ message: 'Comanda atualizada com sucesso.' });
          } 
          else {
            console.log('comanda nao existe')
            const novaComanda = new comanda(req.body);
            await novaComanda.save();
            return res.status(201).json({ message: 'Comanda criada com sucesso.' });
          }
            
    } catch (error) {
      res
        .status(500)
        .send({ message: `${error} - não foi possivel inserir o comanda` });
    }
  };

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