import express from "express";
const router = express.Router();
import multer from "multer";
import userController from "../controllers/user.js";
import check from "../middlewares/auth.js"; //para pasar el token de autenticación

//configuracion de subidad de archivos
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,"./uploads/avatars")
    },

    filename: (req,file,cb)=>{
        cb(null,"avatar-"+Date.now()+file.originalname);
    }
});

//configuracion de multer con el storage
const uploads = multer({storage});

//Definir rutas
router.get("/test-user",check.auth, userController.testUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile/:id", check.auth,userController.profile);
router.get("/list/:page?", check.auth, userController.list);
router.put("/update", check.auth,userController.update);
router.post("/upload",[check.auth, uploads.single("file0")],userController.upload);


//Exportar el router
export default router;