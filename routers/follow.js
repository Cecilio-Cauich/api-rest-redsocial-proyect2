import express from "express";
const router = express.Router();
import followController from "../controllers/follow.js";

//Definir rutas
router.get("/test-follow",followController.testFollow);


//Exportar el router
export default router;