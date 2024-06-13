import mongoose, { SchemaTypes } from "mongoose";

const bebidaSchema = new mongoose.Schema(
    [ 
        {
        id: {type: SchemaTypes.ObjectId},
        bebida: {type: String},
        valor: {type: Number}    
        }
    ]
)

const bebida = mongoose.model('bebidas', bebidaSchema)

export default bebida 