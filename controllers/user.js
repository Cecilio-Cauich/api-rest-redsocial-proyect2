//importar dependencias y modulos
import user from "../models/user.js";

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
  //crear objeto de usuario
  let user_to_save = new user(params);

  //control de usuarios duplicados
  user.find({
      $or: [
        { email: user_to_save.mail.toLowerCase() },
        { nick: user_to_save.nick.toLowerCase },
      ],
    })
    .exec.then((users) => {
      if (users && user.length >= 1) {
        return res.status(200).send({
          status: "Succes",
          message: "User already exists",
        });
      }

      //cifrar la contraseña

      //Guardar usuario en la base de datos

      //devolver resultado
      return res.status(200).json({
        status: "Succes",
        message: "Accion de registro de usuario",
        params,
        user_to_save,
      });

    });
};

export default {
  testUser,
  register,
};
