import { Router } from "express";
import discordRoutes from "./discord.routes.js";

const apiRoutes = Router();

apiRoutes.use("/", discordRoutes);

export default apiRoutes;