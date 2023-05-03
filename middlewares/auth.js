//importar modulos
import jwt from "jwt-simple";
import moment from "moment";


//importar clave secreta
import libjwt from "../services/jwt.js";
const secret = libjwt.secret;

//Middleware de autenticación
const auth = (req,res,next)=>{
    //comprobar si me llega la cabecera de auth
    if(!req.headers.authorization){
        return res.status(403).send({
            status : "Error",
            message: "The request does not have the authentication header"
        });

    }

    //limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g,'');

    //decodificar el token
    try{
        let payload = jwt.decode(token,secret);

        //comprobar expiración de token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "Error",
                message: "Expired token",
            });
        }

        //datos de usuario a la request
        req.user = payload;

    }catch(error){
        return res.status(404).send({
            status: "Error",
            message: "Invalid token",
            error
        })

    }

    //pasar a la ajecución de la acción
    next();

}

export default{
    auth
}
