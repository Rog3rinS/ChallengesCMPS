import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/upload.js"

import SessionController from "./controllers/SessionController.js";
import HouseController from "./controllers/HouseController.js";
import DashboardController from "./controllers/DashboardController.js";
import ReserverController from "./controllers/ReserverController.js";

const routes = new Router()
const upload = multer(uploadConfig);

routes.post("/sessions", SessionController.store);

routes.post("/houses", upload.single("thumbnail"), HouseController.store);
routes.get("/houses", HouseController.index);
routes.put("/houses/:house_id", upload.single("thumbnail"), HouseController.update);
routes.delete("/houses", HouseController.destroy);

routes.get("/dashboard", DashboardController.show);

routes.post("/houses/:house_id/reserve", ReserverController.store);
routes.get("/reserves", ReserverController.index);
routes.delete("/reserves/cancel", ReserverController.destroy);

export default routes;
