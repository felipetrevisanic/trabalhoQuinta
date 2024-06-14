import mongoose, { SchemaTypes } from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';
import produto from './produto.js'
import bebida from './bebida.js'
import combo from './combo.js'

const AutoIncrement = AutoIncrementFactory(mongoose);

const comandaSchema = new mongoose.Schema(
    [ 
        {
        id: {type: SchemaTypes.ObjectId},
        cliente: [
            {
                nome: {type: String},
                mesa: {type:Number},
                produtos: [produto.schema],
                bebidas: [bebida.schema],
                combos: [combo.schema],
                comentarios: [{type: String}]
        
            }
            ]    
        }
    ]
)

comandaSchema.plugin(AutoIncrement, { inc_field: 'comanda' });


const comanda = mongoose.model('comandas', comandaSchema)

export default comanda