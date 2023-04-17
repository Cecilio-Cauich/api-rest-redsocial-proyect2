import express from "express";
const router = express.Router();
import userController from "../controllers/user.js";

//Definir rutas
router.get("/test-user",userController.testUser);


//Exportar el router
export default router;