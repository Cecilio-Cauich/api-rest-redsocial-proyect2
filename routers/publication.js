import express from "express";
const router = express.Router();
import publicationController from "../controllers/publication.js";

//Definir rutas
router.get("/test-publication",publicationController.testPublication);


//Exportar el router
export default router;