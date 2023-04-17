//importar dependencias
import connection from "./database/connection.js";
import express from "express";
import cors from "cors";

//carga de rutas
import userRoutes from "./routers/user.js";
import publicationRoutes from "./routers/publication.js";
import followRoutes from "./routers/follow.js";

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
//-se carga al inicio
app.use("/api",userRoutes);
app.use("/api",publicationRoutes);
app.use("/api",followRoutes);


//Poner el servidor a escuchar peticiones http
app.listen(puerto,()=>{
    console.log("Servidor de node corriendo en el puerto: ",puerto);
});
//