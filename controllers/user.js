//importar dependencias, modulos y servicios
import user from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "../services/jwt.js";
//import mongoosePaginate from "mongoose-pagination";

//acciones de prueba
const testUser = (req, res) => {
  return res.status(200).send({
    message: "Message sended from: controllers/user.js",
    usuario: req.user,
  });
};

//******************************** REGISTRO DE USUARIO *************************
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
  try {
    //control de usuarios duplicados
    user
      .find({
        $or: [
          { email: params.email.toLowerCase() },
          { nick: params.nick.toLowerCase() },
        ],
      })
      .exec()
      .then(async (users) => {
        if (users && users.length >= 1) {
          return res.status(200).send({
            status: "Succes",
            message: "User already exists",
          });
        }

        //cifrar la contraseña
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        //crear objeto de usuario para guardar el usuario
        let user_to_save = new user(params);

        //Guardar usuario en la base de datos
        user_to_save.save().then((user_stored) => {
          if (!user_stored) {
            return res.status(400).json({
              status: "error",
              message: "Error trying to save user",
            });
          }
          //devolver resultado
          return res.status(200).json({
            status: "Succes",
            message: "User save successfully",
            params,
          });
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Register failer",
    });
  }
};

//************************************** LOGIN *******************************
const login = (req, res) => {
  //Recoger paramtros body
  let params = req.body;

  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "Error",
      message: "Missing data to send",
    });
  }

  //Buscar en la bdd si existe ese usuario
  try {
    user
      .findOne({ email: params.email })
      .select({
        //"password":0
      })
      .exec()
      .then((user_f) => {
        if (!user_f) {
          return res.status(404).send({
            status: "error",
            message: "User does not exist",
          });
        }

        //Comprobar su contraseña
        let pwd = bcrypt.compareSync(params.password, user_f.password);
        if (!pwd) {
          return res.status(400).send({
            status: "Error",
            message: "The credentials are not correct",
          });
        }

        //Devolver Token
        const token = jwt.createToken(user_f);

        //Devolver Datos del usuario
        return res.status(200).send({
          status: "succes",
          message: " You have correctly identified",
          user: {
            id: user_f.id,
            name: user_f.name,
            nick: user_f.nick,
          },
          token,
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Logging failed",
    });
  }
};

//*********************************OBTENER DATOS DEL PERFIL DEL USUARIO *****************
const profile = (req, res) => {
  //Recibir el paramatro del id de usuario por la URL
  let usuario = req.body;
  console.log(usuario);
  const id = req.params.id;

  try {
    //Consultar para sacar datos del usuario
    user
      .findById(id)
      .select({
        password: 0,
        role: 0,
      })
      .exec()
      .then((user_profile) => {
        if (!user_profile) {
          return res.status(404).send({
            status: "Error",
            message: "User does not exist or there is an error",
          });
        }

        return res.status(200).send({
          status: "Success",
          user: user_profile,
        });
      });

    //Devolver resultado
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Getting user information failed",
    });
  }
};

//*********************************OBTENER LISTA DE USUARIO********************
const list = (req, res) => {
  //controlar en que paginas estamos

  let page = 1; //por default la pagina es 1
  if (req.params.page) {
    page = req.params.page; //si nos lo mandan como param entonces tomamos ese valor
  }
  page = parseInt(page);

  //Consulta con mongoose pagination
  let itemsPerPage = 5;
  try {
    user
      .find()
      .sort("_id")
      .paginate(page, itemsPerPage)
      .then(async (users) => {
        const total = await user.countDocuments({}).exec(); //obtener total

        if (!users) {
          return res.status(404).send({
            status: "Error",
            message: "There is not users available ",
          });
        }
        //Devolver resultado
        return res.status(200).send({
          status: "Success",
          users,
          page,
          itemsPerPage,
          total: total,
          pages: Math.ceil(total / itemsPerPage),
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Listing failed",
      error: error.message,
    });
  }
};
//*********************************ACTUALIZAR ASUARIO********************
const update = (req, res) => {
  //Recoger info del usuario a actualizar
  let userIdentity = req.user;
  let userToUpdate = req.body;

  //Eliminar campos sombrantes
  delete userToUpdate.iat;
  delete userToUpdate.exp;
  delete userToUpdate.role;
  delete userToUpdate.image;

  //Comprobar si el usuario ya existe
  try {
    user
      .find({
        $or: [
          { email: userToUpdate.email.toLowerCase() },
          { nick: userToUpdate.nick.toLowerCase() },
        ],
      })
      .exec()
      .then(async (users) => {
        let userIsset = false;

        //Buscamos dentro de los usuarios que devuelve find el que sea igual al logeado
        users.forEach((user_f) => {
          if (user_f && user_f._id != userIdentity.id) {
            userIsset = true;
          }
        });

        if (userIsset) {
          return res.status(200).send({
            status: "Succes",
            message: "User already exists",
          });
        }

        //cifrar la contraseña
        if (userToUpdate.password) {
          let pwd = await bcrypt.hash(userToUpdate.password, 10);
          userToUpdate.password = pwd;
        }

        //Buscar y actualizar
        let userUpdated = await user.findByIdAndUpdate(
          userIdentity.id,
          userToUpdate,
          { new: true }
        );

        if (!userUpdated) {
          return res.status(500).send({
            status: "Error",
            message: "Update Failed",
          });
        }

        //devolver respuesta
        return res.status(200).send({
          status: "Succes",
          message: "User updated successfully",
          user: userUpdated,
        });

      });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Actualization failed",
    });
  }
};
export default {
  testUser,
  register,
  login,
  profile,
  list,
  update,
};
