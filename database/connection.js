import mongoose from "mongoose";


const connection = async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/mi_redsocial");

        console.log("conectado correctamente a bd: mi_redsocial");

    }catch(error){
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
        
    }
}

export default connection;
