//importar dependencias y modulos
import user from "../models/user.js";
import bcrypt from "bcrypt";

//acciones de prueba
const testUser = (req, res) => {
  return res.status(200).send({
    message: "Message sended from: controllers/user.js",
  });
};

//registro de usuario
const register = (req, res) => {
  //recoger datos de la petición
  let params = req.body;

  //comprobar que llegan los datos(validacion)
  if (!params.name || !params.email || !params.password || !params.nick) {
    return res.status(400).json({
      status: "error",
      message: "Missing data to send",
    });
  }

  //control de usuarios duplicados
  user.find({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    })
    .exec().then(async(users) => {
      if (users && users.length >= 1) {
        return res.status(200).send({
          status: "Succes",
          message: "User already exists",
        });
      }

      //cifrar la contraseña
      // bcrypt.hash(user_to_save.password, 10,(error, pwd)=>{
      //   user_to_save.password = pwd;
        
      // });

      let pwd = await bcrypt.hash(params.password,10);
     params.password = pwd;
      
      //crear objeto de usuario para guardar el usuario
      let user_to_save = new user(params);
      
      //Guardar usuario en la base de datos
      user_to_save.save().then((user_stored)=>{
        
        if(!user_stored){
          return res.status(400).json({
            status: error,
            message: "Error al guardar usuario"
          });
        }

        //devolver resultado
        return res.status(200).json({
          status: "Succes",
          message: "Accion de registro de usuario",
          params,
        });


      }); 


    });
};

export default {
  testUser,
  register,
};
