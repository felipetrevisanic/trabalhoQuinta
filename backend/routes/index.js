import express from "express";
import produto from './produtoRoute.js'
import comanda from './comandaRoute.js'
import bebida from './bebidaRoute.js'
import combo from './comboRoute.js'


const routes = (app) => {
    app.route('/').get((req,res) => {
        res.status(200).send({titulo: "funcionando"})
    })

    app.use(
        express.json(),
        produto,
        comanda,
        bebida,
        combo
    )
}

export default routes