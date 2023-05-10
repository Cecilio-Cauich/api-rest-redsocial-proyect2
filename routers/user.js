import express from "express";
const router = express.Router();
import userController from "../controllers/user.js";
import check from "../middlewares/auth.js"; //para pasar el token de autenticación

//Definir rutas
router.get("/test-user",check.auth, userController.testUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile/:id", check.auth,userController.profile);
router.get("/list/:page?", check.auth, userController.list);
router.put("/update", check.auth,userController.update);


//Exportar el router
export default router;