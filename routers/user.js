import express from "express";
const router = express.Router();
import userController from "../controllers/user.js";

//Definir rutas
router.get("/test-user",userController.testUser);
router.post("/register",userController.register);
router.post("/login",userController.login);


//Exportar el router
export default router;