//importar dependencias
import connection from "./database/connection.js";
import express from "express";
import cors from "cors";

//Mensaje de bienvenida
console.log("API NODE para RED SOCIAL arrancada");

//conexion a la base de datos
connection();

//crear servidor node
const app = express();
const puerto = 3900;

//configurar el cors
app.use(cors());

//convertir los datos del body a objetos JS
app.use(express.json());  //conviete los datos del body en objetos json
app.use(express.urlencoded({extended:true})); //convierte en objetos usables por js los datos que llegan en urlencoded


//cargar conf rutas


//rutas de prueba
app.get("/ruta-prueba",(req,res)=>{
    return res.status(200).json(
        {
            "id":1,
            "nombre":"Cecilio",
            "web":"www.cecilio.com"
        }
    );
});

//Poner el servidor a escuchar peticiones http
app.listen(puerto,()=>{
    console.log("Servidor de node corriendo en el puerto: ",puerto);
});
//